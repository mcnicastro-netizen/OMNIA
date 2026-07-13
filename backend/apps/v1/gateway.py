"""OMNIA — Public v1 API Gateway (M2.5.2 Track B, D-041).

Endpoints under `/api/v1/*` — authenticated via Bearer API key (no cookie/JWT).
Every call debits credits from the key's wallet and is logged to `api_usage_log`.

Endpoints (v1):
    POST /api/v1/valuator            — property valuation UNI 10750 (5 credits)
    POST /api/v1/mortgages/compare   — mortgage comparison (1 credit)
    POST /api/v1/legal/ask           — HAL Legal one-shot Q&A (3 credits)
    GET  /api/v1/feed/properties     — export the agency inventory (free)
    GET  /api/v1/me                  — inspect the API key + balance (free)
    GET  /api/v1/health              — no-auth ping

For the async Virtual Staging pipeline (~15 credits), see /api/v1/staging/*
in M2.5.3 (widget-friendly) — placeholder 501 in this MVP.
"""
import logging
import os
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from shared.db.connection import Database
from shared.auth.api_key import make_key_dep, charge_and_log, CREDIT_COSTS

# Reuse the existing business models & handlers where possible
from apps.immocloud.valuator import (
    estimate_value as _valuator_run,
    ValuationPayload,
)
from apps.immocloud.mutui import (
    compare_mortgages as _mutui_compare_run,
    CompareBody,
)

# HAL Legal — we call the LLM helper directly, no session persistence for v1
from apps.immoweb.al_legal.router import _call_llm as _legal_call_llm

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["v1"])


# ---------------- HEALTH ----------------

@router.get("/health")
async def v1_health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "api_version": "v1",
        "credit_costs": CREDIT_COSTS,
        "docs_hint": "Authenticate with header 'Authorization: Bearer omk_live_...'",
    }


# ---------------- ME (inspect key) ----------------

@router.get("/me")
async def v1_me(request: Request, key=Depends(make_key_dep("feed_properties"))) -> Dict[str, Any]:
    """Return the calling API key metadata + credit balance."""
    try:
        return {
            "id": key["id"],
            "name": key["name"],
            "key_prefix": key["key_prefix"],
            "agency_id": key["agency_id"],
            "group_id": key.get("group_id"),
            "partner_id": key.get("partner_id"),
            "credits_balance": key.get("credits_balance", 0),
            "credits_spent": key.get("credits_spent", 0),
            "is_active": key.get("is_active", True),
        }
    finally:
        await charge_and_log(request, status_code=200)


# ---------------- VALUATOR ----------------

@router.post("/valuator")
async def v1_valuator(
    payload: ValuationPayload,
    request: Request,
    key=Depends(make_key_dep("valuator")),
) -> Dict[str, Any]:
    """UNI 10750 valuation (5 credits). Wraps `/api/cloud/valuator`."""
    try:
        result = await _valuator_run(payload)
        # Track B: strip lead capture side-effects (no `valuation_leads` row here)
        # The wrapped handler already inserts into DB if payload has email/name;
        # partner integrations typically don't want that. Leave that behavior
        # opt-in for now — the caller controls it by omitting email/name.
        await charge_and_log(request, status_code=200)
        return {"data": result, "credits_charged": request.state.api_cost}
    except HTTPException as e:
        await charge_and_log(request, status_code=e.status_code, error_code=str(e.detail)[:60])
        raise
    except Exception as e:
        await charge_and_log(request, status_code=500, error_code=type(e).__name__)
        logger.exception("v1_valuator failed")
        raise HTTPException(status_code=500, detail="internal_error")


# ---------------- MORTGAGES ----------------

@router.post("/mortgages/compare")
async def v1_mortgages_compare(
    body: CompareBody,
    request: Request,
    key=Depends(make_key_dep("mortgages_compare")),
) -> Dict[str, Any]:
    """Compare mortgage offers (1 credit). Wraps `/api/cloud/mutui/compare`."""
    try:
        result = await _mutui_compare_run(body)
        await charge_and_log(request, status_code=200)
        return {"data": result, "credits_charged": request.state.api_cost}
    except HTTPException as e:
        await charge_and_log(request, status_code=e.status_code, error_code=str(e.detail)[:60])
        raise
    except Exception as e:
        await charge_and_log(request, status_code=500, error_code=type(e).__name__)
        logger.exception("v1_mortgages_compare failed")
        raise HTTPException(status_code=500, detail="internal_error")


# ---------------- HAL LEGAL (one-shot Q&A) ----------------

class LegalAskBody(BaseModel):
    question: str = Field(min_length=3, max_length=2000)
    lang: str = Field(default="it", pattern="^(it|en|es)$")


@router.post("/legal/ask")
async def v1_legal_ask(
    body: LegalAskBody,
    request: Request,
    key=Depends(make_key_dep("legal_ask")),
) -> Dict[str, Any]:
    """One-shot legal Q&A (3 credits). Reuses HAL Legal LLM stack (no session)."""
    try:
        system_prompt = (
            "Sei HAL Legal, assistente informativo giuridico-notarile italiano. "
            "Rispondi in modo sintetico (max 400 parole), cita norme e fonti quando possibile, "
            "e ricorda che le tue risposte sono orientative e non sostituiscono un parere di notaio/avvocato. "
            f"Rispondi in lingua: {body.lang}."
        )
        answer = await _legal_call_llm(
            system_prompt=system_prompt,
            user_msg=body.question,
            session_id=f"apikey_{key['id'][:8]}",
        )
        await charge_and_log(request, status_code=200)
        return {
            "data": {
                "question": body.question,
                "answer": answer,
                "disclaimer": "Informazioni orientative. Non sostituisce parere legale (L.247/2012).",
            },
            "credits_charged": request.state.api_cost,
        }
    except HTTPException as e:
        await charge_and_log(request, status_code=e.status_code, error_code=str(e.detail)[:60])
        raise
    except Exception as e:
        await charge_and_log(request, status_code=500, error_code=type(e).__name__)
        logger.exception("v1_legal_ask failed")
        raise HTTPException(status_code=500, detail="internal_error")


# ---------------- FEED / PROPERTIES ----------------

@router.get("/feed/properties")
async def v1_feed_properties(
    request: Request,
    limit: int = 100,
    offset: int = 0,
    status: str = "active",
    key=Depends(make_key_dep("feed_properties")),
) -> Dict[str, Any]:
    """
    Export the agency's inventory as JSON (free). For XML/OSF feed use
    the existing public `/api/feed/{slug}.xml` (no API key required, SEO-friendly).
    """
    try:
        db = Database.get()
        limit = max(1, min(limit, 500))
        offset = max(0, offset)
        flt = {"agency_id": key["agency_id"]}
        if status and status != "all":
            flt["status"] = status
        cursor = (
            db.properties.find(flt, {"_id": 0, "photos": 0})
            .sort("created_at", -1)
            .skip(offset)
            .limit(limit)
        )
        items = await cursor.to_list(length=limit)
        total = await db.properties.count_documents(flt)
        await charge_and_log(request, status_code=200)
        return {
            "data": {"items": items, "total": total, "limit": limit, "offset": offset},
            "credits_charged": 0,
        }
    except Exception as e:
        await charge_and_log(request, status_code=500, error_code=type(e).__name__)
        logger.exception("v1_feed_properties failed")
        raise HTTPException(status_code=500, detail="internal_error")


# ---------------- STAGING (placeholder) ----------------

@router.post("/staging/render")
async def v1_staging_render(request: Request,
                            key=Depends(make_key_dep("staging_render"))) -> Dict[str, Any]:
    """Reserved for M2.5.3 (widget-friendly async pipeline). Returns 501 for now."""
    await charge_and_log(request, status_code=501, error_code="not_implemented")
    raise HTTPException(
        status_code=501,
        detail="staging_via_api_available_in_m2_5_3",
    )
