"""OMNIA — ImmoWeb routes (B2B agency CRM)."""
from fastapi import APIRouter, Header
from typing import Optional

from shared.models.base import HealthResponse
from shared.utils.i18n import t, normalize_lang
from shared.db.connection import set_current_lang

from apps.immoweb.agencies import router as agencies_router
from apps.immoweb.invites import router as invites_router
from apps.immoweb.dashboard import router as dashboard_router
from apps.immoweb.properties import router as properties_router
from apps.immoweb.clients import router as clients_router
from apps.immoweb.clients_smart import router as clients_smart_router
from apps.immoweb.clients_ai_import import router as clients_ai_import_router
from apps.immoweb.matches import router as matches_router
from apps.immoweb.portals import router as portals_router
from apps.immoweb.brand_extractor import router as brand_router
from apps.immoweb.custom_domain import router as custom_domain_router
from apps.immoweb.themes import router as themes_router
from apps.immoweb.moderation import router as moderation_router
from apps.immoweb.cron import router as cron_router

router = APIRouter(prefix="/app", tags=["immoweb"])


@router.get("/health", response_model=HealthResponse)
async def app_health(accept_language: Optional[str] = Header(None)):
    lang = normalize_lang(accept_language)
    set_current_lang(lang)
    return HealthResponse(
        app="immoweb",
        lang=lang,
        message={"text": t("app.immoweb", lang=lang)},
    )


# Mount sub-routers
router.include_router(agencies_router)
router.include_router(invites_router)
router.include_router(dashboard_router)
router.include_router(properties_router)
router.include_router(clients_smart_router)
router.include_router(clients_ai_import_router)
router.include_router(clients_router)
router.include_router(matches_router)
router.include_router(portals_router)
router.include_router(brand_router)
router.include_router(custom_domain_router)
router.include_router(themes_router)
router.include_router(moderation_router)
router.include_router(cron_router)
