"""OMNIA — ImmobilCloud routes (B2C portal)."""
from fastapi import APIRouter, Header
from typing import Optional

from shared.models.base import HealthResponse
from shared.utils.i18n import t, normalize_lang
from shared.db.connection import set_current_lang
from apps.immocloud.public_portal import router as public_portal_router

router = APIRouter(prefix="/cloud", tags=["immocloud"])


@router.get("/health", response_model=HealthResponse)
async def cloud_health(accept_language: Optional[str] = Header(None)):
    lang = normalize_lang(accept_language)
    set_current_lang(lang)
    return HealthResponse(
        app="immocloud",
        lang=lang,
        message={"text": t("app.immocloud", lang=lang)},
    )


router.include_router(public_portal_router)
