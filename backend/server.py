"""OMNIA — Backend entry point.

Logical Monorepo architecture (D-015):
- 1 FastAPI app serves all OMNIA sub-apps under /api/{app}/...
- All routes are tenant-aware via shared.db (multi-tenant pattern D-013)
- i18n native via Accept-Language header (D-014)
"""
import logging
import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter, Header, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Make backend/ importable as root for `shared` and `apps`
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / ".env")

from shared.db.connection import Database, ensure_indexes, set_current_lang  # noqa: E402
from shared.utils.i18n import normalize_lang, _load_locales, t  # noqa: E402
from shared.models.base import HealthResponse  # noqa: E402

from apps.core.routes import router as core_router  # noqa: E402
from apps.core.auth import router as auth_router  # noqa: E402
from apps.core.seed import seed_admin  # noqa: E402
from apps.immocloud.routes import router as immocloud_router  # noqa: E402
from apps.immoweb.routes import router as immoweb_router  # noqa: E402
from apps.academy.routes import router as academy_router  # noqa: E402


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("omnia")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Database.connect()
    await ensure_indexes()
    _load_locales()
    await seed_admin()
    try:
        from apps.immoweb.virtual_staging import reap_stale_jobs
        reaped = await reap_stale_jobs()
        if reaped:
            logger.info("Reaped %d stale virtual staging jobs", reaped)
    except Exception as e:
        logger.warning("Staging reaper failed: %s", e)
    logger.info("OMNIA backend ready.")
    yield
    # Shutdown
    await Database.close()
    logger.info("OMNIA backend stopped.")


app = FastAPI(
    title="OMNIA Real Estate Ecosystem API",
    version="0.1.0",
    description="Backend per ImmobilCloud + ImmoWeb + Omnia Academy",
    lifespan=lifespan,
)

# CORS (allow Emergent preview + production subdomains)
allowed = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[o.strip() for o in allowed if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Host-based routing for verified custom domains (M2.S6)
from apps.immoweb.host_routing import HostRoutingMiddleware
app.add_middleware(HostRoutingMiddleware)


@app.middleware("http")
async def language_middleware(request: Request, call_next):
    """Set request language from Accept-Language or ?lang= query."""
    lang_q = request.query_params.get("lang")
    lang_h = request.headers.get("accept-language")
    lang = normalize_lang(lang_q or lang_h)
    set_current_lang(lang)
    response = await call_next(request)
    response.headers["X-OMNIA-Lang"] = lang
    return response


# Main /api router
api_router = APIRouter(prefix="/api")


@api_router.get("/", response_model=HealthResponse)
async def api_root(accept_language: str = Header(None)):
    lang = normalize_lang(accept_language)
    return HealthResponse(
        app="omnia",
        lang=lang,
        message={
            "text": t("welcome.greeting", lang=lang),
            "apps": ["core", "cloud", "app", "learn"],
        },
    )


@api_router.get("/health", response_model=HealthResponse)
async def global_health(accept_language: str = Header(None)):
    lang = normalize_lang(accept_language)
    db_status = "ok"
    try:
        db = Database.get()
        await db.command("ping")
    except Exception as e:
        db_status = f"error: {e}"
    return HealthResponse(
        app="omnia",
        lang=lang,
        message={"text": t("health.ok", lang=lang), "db": db_status},
    )


# Mount sub-apps
api_router.include_router(auth_router)
api_router.include_router(core_router)
api_router.include_router(immocloud_router)
api_router.include_router(immoweb_router)
api_router.include_router(academy_router)

# Public Feed (OSF v1.0) — M2.S5 Layer B (no auth, portals pull anonymously)
from apps.immoweb.feed import router as public_feed_router  # noqa: E402
api_router.include_router(public_feed_router)

# Public Site (Layer C) — HTML pages crawlable by portals + photo binary serving
from apps.immoweb.site import router as public_site_router  # noqa: E402
api_router.include_router(public_site_router)

from apps.marketing.founders import router as founders_router  # noqa: E402
api_router.include_router(founders_router)

# Public v1 API Gateway (M2.5.2 Track B, D-041) — Bearer API-key auth
from apps.v1.gateway import router as v1_gateway_router  # noqa: E402
api_router.include_router(v1_gateway_router)

# M2.5.3 — Widget assets (loader.js + widget HTML pages) served from backend.
from apps.v1.widgets import router as v1_widgets_router  # noqa: E402
api_router.include_router(v1_widgets_router)

app.include_router(api_router)


@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    lang = normalize_lang(request.headers.get("accept-language"))
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"detail": t("error.server", lang=lang)},
    )
