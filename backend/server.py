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

app.include_router(api_router)


@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    lang = normalize_lang(request.headers.get("accept-language"))
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"detail": t("error.server", lang=lang)},
    )
