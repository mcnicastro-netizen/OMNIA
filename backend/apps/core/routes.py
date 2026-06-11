"""OMNIA — Core routes (auth, agencies, health, system-level)."""
from fastapi import APIRouter, Header
from typing import Optional

from shared.models.base import HealthResponse
from shared.db.connection import Database, get_current_lang, set_current_lang
from shared.utils.i18n import t, normalize_lang

router = APIRouter(prefix="/core", tags=["core"])


@router.get("/health", response_model=HealthResponse)
async def health(accept_language: Optional[str] = Header(None)):
    """Global health check — verifies backend + Mongo are reachable."""
    lang = normalize_lang(accept_language)
    set_current_lang(lang)
    db = Database.get()
    try:
        await db.command("ping")
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {e}"
    return HealthResponse(
        app="core",
        lang=lang,
        message={
            "text": t("health.ok", lang=lang),
            "db": db_status,
        },
    )
