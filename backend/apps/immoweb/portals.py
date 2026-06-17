"""OMNIA — Portal Subscriptions API (M2.S5 Layer A, D-029).

Manage agency-level credentials for publishing portals (Idealista, Immobiliare.it,
Casa.it, Wikicasa, Subito.it, Facebook Catalog, LinkedIn, …).

Passwords/api keys are stored encrypted with Fernet. Cleartext NEVER leaves the API.
"""
import base64
import logging
import os
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException

from shared.auth.dependencies import get_current_user, require_roles
from shared.db.connection import Database
from shared.models.portal import (
    PORTAL_CATALOG,
    PortalSubscriptionCreate,
    PortalSubscriptionUpdate,
    now_iso,
)

logger = logging.getLogger("omnia.portals")
router = APIRouter(prefix="/portals", tags=["portals"])


# ---------------- crypto helpers ----------------
_FERNET = None
def _fernet():
    """Lazy-load Fernet. Derive a deterministic key from OMNIA_PORTAL_ENC_KEY (any string).
    If missing, derive from JWT secret as a soft fallback (warn loudly)."""
    global _FERNET
    if _FERNET is not None:
        return _FERNET
    from cryptography.fernet import Fernet
    import hashlib
    src = os.environ.get("OMNIA_PORTAL_ENC_KEY") or os.environ.get("JWT_SECRET", "")
    if not src:
        raise RuntimeError("Neither OMNIA_PORTAL_ENC_KEY nor JWT_SECRET set — cannot init portal crypto.")
    key = base64.urlsafe_b64encode(hashlib.sha256(src.encode()).digest())
    _FERNET = Fernet(key)
    return _FERNET


def _encrypt(plain: Optional[str]) -> Optional[str]:
    if not plain:
        return None
    return _fernet().encrypt(plain.encode()).decode()


def _decrypt(token: Optional[str]) -> Optional[str]:
    if not token:
        return None
    try:
        return _fernet().decrypt(token.encode()).decode()
    except Exception:
        return None


def _catalog_entry(code: str) -> Optional[Dict[str, Any]]:
    return next((p for p in PORTAL_CATALOG if p["code"] == code), None)


def _next_run(frequency: str) -> Optional[str]:
    deltas = {
        "hourly": timedelta(hours=1),
        "every_4h": timedelta(hours=4),
        "daily": timedelta(hours=24),
        "weekly": timedelta(days=7),
    }
    if frequency not in deltas:
        return None
    return (datetime.now(timezone.utc) + deltas[frequency]).isoformat()


async def _agency(user: dict) -> str:
    ag = user.get("agency_ids") or []
    if not ag:
        raise HTTPException(status_code=400, detail="no_agency")
    return ag[0]


def _to_public(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Strip sensitive fields + enrich with catalog metadata."""
    cat = _catalog_entry(doc["portal_code"]) or {}
    return {
        "id": doc["id"],
        "agency_id": doc["agency_id"],
        "portal_code": doc["portal_code"],
        "portal_name": cat.get("name", doc["portal_code"]),
        "site": cat.get("site", ""),
        "mode": cat.get("mode", "pull_xml"),
        "credentials": doc.get("credentials") or {},
        "has_password": bool(doc.get("password_enc")),
        "frequency": doc.get("frequency", "daily"),
        "enabled": doc.get("enabled", False),
        "status": doc.get("status", "pending"),
        "last_transfer_at": doc.get("last_transfer_at"),
        "next_transfer_at": doc.get("next_transfer_at"),
        "last_error": doc.get("last_error"),
        "notes": doc.get("notes"),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }


# ---------------- endpoints ----------------

@router.get("/catalog")
async def list_portal_catalog(user: dict = Depends(get_current_user)):
    """Built-in registry of supported portals. Agency subscribes to one of these."""
    return {"items": PORTAL_CATALOG, "total": len(PORTAL_CATALOG)}


@router.get("")
async def list_subscriptions(user: dict = Depends(get_current_user)):
    agency_id = await _agency(user)
    docs = await Database.get().portal_subscriptions.find(
        {"agency_id": agency_id}, {"_id": 0},
    ).sort("created_at", -1).to_list(length=200)
    items = [_to_public(d) for d in docs]
    # Augment with catalog entries the agency hasn't subscribed to yet
    subscribed = {d["portal_code"] for d in docs}
    available = [c for c in PORTAL_CATALOG if c["code"] not in subscribed]
    return {"items": items, "total": len(items), "available": available}


@router.post("")
async def create_subscription(
    payload: PortalSubscriptionCreate,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    cat = _catalog_entry(payload.portal_code)
    if not cat:
        raise HTTPException(status_code=400, detail="unknown_portal_code")
    agency_id = await _agency(user)
    db = Database.get()
    # Idempotency: one subscription per (agency, portal)
    if await db.portal_subscriptions.find_one({"agency_id": agency_id, "portal_code": payload.portal_code}):
        raise HTTPException(status_code=409, detail="subscription_already_exists")
    now = now_iso()
    doc = {
        "id": str(uuid4()),
        "agency_id": agency_id,
        "portal_code": payload.portal_code,
        "credentials": payload.credentials.model_dump(exclude_none=True),
        "password_enc": _encrypt(payload.password),
        "frequency": payload.frequency,
        "enabled": payload.enabled,
        "status": "active" if payload.enabled else "disabled",
        "last_transfer_at": None,
        "next_transfer_at": _next_run(payload.frequency) if payload.enabled else None,
        "last_error": None,
        "notes": payload.notes,
        "created_at": now,
        "updated_at": now,
    }
    await db.portal_subscriptions.insert_one(doc)
    return _to_public(doc)


@router.patch("/{sid}")
async def update_subscription(
    sid: str,
    payload: PortalSubscriptionUpdate,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    agency_id = await _agency(user)
    db = Database.get()
    existing = await db.portal_subscriptions.find_one({"id": sid, "agency_id": agency_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="subscription_not_found")
    data = payload.model_dump(exclude_unset=True)
    update_doc = {"updated_at": now_iso()}
    if "credentials" in data and data["credentials"] is not None:
        update_doc["credentials"] = {k: v for k, v in data["credentials"].items() if v is not None}
    if "password" in data:
        # explicit set OR clear (None → clear)
        update_doc["password_enc"] = _encrypt(data["password"]) if data["password"] else None
    if "frequency" in data and data["frequency"] is not None:
        update_doc["frequency"] = data["frequency"]
        # reschedule next_run
        is_enabled = data.get("enabled", existing.get("enabled", False))
        update_doc["next_transfer_at"] = _next_run(data["frequency"]) if is_enabled else None
    if "enabled" in data and data["enabled"] is not None:
        update_doc["enabled"] = data["enabled"]
        update_doc["status"] = "active" if data["enabled"] else "disabled"
        if data["enabled"]:
            update_doc["next_transfer_at"] = _next_run(data.get("frequency") or existing.get("frequency", "daily"))
        else:
            update_doc["next_transfer_at"] = None
    if "notes" in data:
        update_doc["notes"] = data["notes"]
    await db.portal_subscriptions.update_one({"id": sid, "agency_id": agency_id}, {"$set": update_doc})
    fresh = await db.portal_subscriptions.find_one({"id": sid, "agency_id": agency_id}, {"_id": 0})
    return _to_public(fresh)


@router.delete("/{sid}")
async def delete_subscription(
    sid: str,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    agency_id = await _agency(user)
    db = Database.get()
    result = await db.portal_subscriptions.delete_one({"id": sid, "agency_id": agency_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="subscription_not_found")
    return {"status": "ok"}


@router.post("/{sid}/test")
async def test_subscription(
    sid: str,
    user: dict = Depends(get_current_user),
):
    """Manual probe: counts active properties exported for this portal.
    Real adapter calls land in M2.S5 sprint 2 (XML feed generator) and sprint 3 (push adapters).
    For now this verifies the subscription is wired and tenant correct.
    """
    agency_id = await _agency(user)
    db = Database.get()
    sub = await db.portal_subscriptions.find_one({"id": sid, "agency_id": agency_id}, {"_id": 0})
    if not sub:
        raise HTTPException(status_code=404, detail="subscription_not_found")
    n_active = await db.properties.count_documents({"agency_id": agency_id, "status": "active"})
    return {
        "portal_code": sub["portal_code"],
        "would_export_count": n_active,
        "mode": (_catalog_entry(sub["portal_code"]) or {}).get("mode"),
        "tested_at": now_iso(),
        "status": "ok",
    }
