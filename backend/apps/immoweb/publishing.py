"""OMNIA — Publishing Center router (M2.6a, D-052 + M2.6b, D-053).

M2.6a: multi-portal outbound publishing layer + compliance HARD filter on feed.
M2.6b: adds sync engine (scheduled + manual) + rich compliance dashboard.
Coexists with legacy portals.py (M2.S5 "portal subscriptions" concept, kept intact).

Endpoints under /api/app/publishing:
    GET    /catalog                             list of supported portals
    GET    /connections                         my agency's activations
    POST   /connections                         activate a portal
    PATCH  /connections/{id}                    update creds / toggle
    DELETE /connections/{id}                    deactivate
    GET    /connections/{id}/logs               recent sync logs
    POST   /connections/{id}/sync-now           M2.6b — trigger sync manually
    GET    /connections/{id}/compliance         M2.6b — compliance snapshot for this agency
    POST   /sync/run-all                        M2.6b — admin cron endpoint (super_admin)
"""
import logging
import re
from datetime import datetime, timezone
from typing import List
from xml.sax.saxutils import escape as xml_escape

from fastapi import APIRouter, HTTPException, Depends, Response

from shared.db.connection import Database
from shared.auth.dependencies import require_roles
from shared.models.portal import (
    PortalConnectionCreate, PortalConnectionUpdate, AgencyPortalConnection,
)
from shared.utils.crypto import encrypt_dict
from shared.validators.compliance import (
    validate_property, summarize_agency_compliance, is_publishable as _validator_is_publishable,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/publishing", tags=["publishing"])


CATALOG_SEED = [
    {"slug": "subito", "name": "Subito.it", "category": "freemium", "dialect": "osf_federata",
     "integration_type": "feed_pull", "traffic_score": 5,
     "credential_fields": [{"name": "username", "label": "Username", "type": "text"},
                           {"name": "api_key", "label": "Chiave partner (opz.)", "type": "text"}],
     "notes": "Piu' grande portale generalista italiano."},
    {"slug": "bakeca", "name": "Bakeca.it", "category": "gratuito", "dialect": "osf_federata",
     "integration_type": "feed_pull", "traffic_score": 3,
     "credential_fields": [{"name": "email", "label": "Email account", "type": "email"}],
     "notes": "Gratuito con pubblicita'. Setup semplice."},
    {"slug": "kijiji", "name": "Kijiji.it", "category": "gratuito", "dialect": "osf_federata",
     "integration_type": "feed_pull", "traffic_score": 2,
     "credential_fields": [{"name": "email", "label": "Email account", "type": "email"}], "notes": "Adevinta group."},
    {"slug": "wikicasa", "name": "Wikicasa.it", "category": "freemium", "dialect": "generic_rss",
     "integration_type": "feed_pull", "traffic_score": 4,
     "credential_fields": [{"name": "api_key", "label": "API Key", "type": "text"}],
     "notes": "Free tier fino a ~20 annunci."},
    {"slug": "facebook-marketplace", "name": "Facebook Marketplace", "category": "gratuito",
     "dialect": "facebook_catalog", "integration_type": "api_push", "traffic_score": 4,
     "credential_fields": [{"name": "page_id", "label": "Page ID", "type": "text"},
                           {"name": "access_token", "label": "Access Token", "type": "text"}],
     "notes": "Meta Business API. Copertura enorme."},
    {"slug": "google-business", "name": "Google Business Profile", "category": "gratuito",
     "dialect": "google_merchant", "integration_type": "api_push", "traffic_score": 4,
     "credential_fields": [{"name": "account_id", "label": "Google Business Account ID", "type": "text"}],
     "notes": "Migliora visibilita' su Google Search / Maps."},
    {"slug": "attico", "name": "Attico.it", "category": "freemium", "dialect": "osf_federata",
     "integration_type": "feed_pull", "traffic_score": 2,
     "credential_fields": [{"name": "email", "label": "Email account", "type": "email"}], "notes": "Free tier limitato."},
    {"slug": "case24", "name": "Case24.it", "category": "freemium", "dialect": "osf_federata",
     "integration_type": "feed_pull", "traffic_score": 2,
     "credential_fields": [{"name": "email", "label": "Email account", "type": "email"}],
     "notes": "Portale generalista minore."},
]


async def seed_publishing_catalog() -> None:
    """Idempotent catalog seed. Called from server startup."""
    db = Database.get()
    now = datetime.now(timezone.utc).isoformat()
    inserted = 0
    for p in CATALOG_SEED:
        existing = await db.publishing_catalog.find_one({"slug": p["slug"]})
        if existing:
            continue
        await db.publishing_catalog.insert_one(
            {**p, "id": p["slug"], "is_active": True, "geographic_scope": "national",
             "created_at": now, "updated_at": now})
        inserted += 1
    if inserted:
        logger.info("publishing_catalog seeded (%d new entries)", inserted)


def _agency_id(user: dict) -> str:
    ids = user.get("agency_ids") or []
    if not ids:
        raise HTTPException(status_code=404, detail="no_agency")
    return ids[0]


def _public(doc: dict) -> dict:
    return {k: v for k, v in doc.items() if k not in ("_id", "credentials_encrypted")}


@router.get("/catalog")
async def catalog(user: dict = Depends(require_roles("agency_admin", "super_admin"))):
    db = Database.get()
    docs = await db.publishing_catalog.find({"is_active": True}, {"_id": 0}).sort("traffic_score", -1).to_list(200)
    return {"items": docs, "total": len(docs)}


@router.get("/connections")
async def list_connections(user: dict = Depends(require_roles("agency_admin", "super_admin"))):
    db = Database.get()
    aid = _agency_id(user)
    docs = await db.publishing_connections.find({"agency_id": aid}).sort("created_at", -1).to_list(200)
    return {"items": [_public(d) for d in docs], "total": len(docs)}


@router.post("/connections", status_code=201)
async def create_connection(
    payload: PortalConnectionCreate,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    db = Database.get()
    aid = _agency_id(user)
    portal = await db.publishing_catalog.find_one({"slug": payload.portal_slug})
    if not portal:
        raise HTTPException(status_code=404, detail="portal_not_in_catalog")
    existing = await db.publishing_connections.find_one(
        {"agency_id": aid, "portal_slug": payload.portal_slug})
    if existing:
        raise HTTPException(status_code=409, detail="already_connected")

    conn = AgencyPortalConnection(
        agency_id=aid, portal_slug=payload.portal_slug,
        status="active" if payload.credentials else "pending",
        credentials_encrypted=encrypt_dict(payload.credentials) if payload.credentials else None,
        is_all_properties=payload.is_all_properties,
    )
    doc = conn.model_dump()
    await db.publishing_connections.insert_one(doc)
    logger.info("publishing_connection_created agency=%s portal=%s", aid, payload.portal_slug)
    return _public(doc)


@router.patch("/connections/{conn_id}")
async def update_connection(
    conn_id: str, payload: PortalConnectionUpdate,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    db = Database.get()
    aid = _agency_id(user)
    conn = await db.publishing_connections.find_one({"id": conn_id, "agency_id": aid})
    if not conn:
        raise HTTPException(status_code=404, detail="connection_not_found")

    update = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if payload.credentials is not None:
        update["credentials_encrypted"] = encrypt_dict(payload.credentials)
        update["status"] = "active"
    if payload.is_all_properties is not None:
        update["is_all_properties"] = payload.is_all_properties
    if payload.status in {"active", "disabled"}:
        update["status"] = payload.status

    await db.publishing_connections.update_one({"id": conn_id}, {"$set": update})
    return _public(await db.publishing_connections.find_one({"id": conn_id}))


@router.delete("/connections/{conn_id}")
async def delete_connection(
    conn_id: str,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    db = Database.get()
    aid = _agency_id(user)
    r = await db.publishing_connections.delete_one({"id": conn_id, "agency_id": aid})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="connection_not_found")
    return {"status": "ok", "id": conn_id}


@router.get("/connections/{conn_id}/logs")
async def connection_logs(
    conn_id: str, limit: int = 20,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    db = Database.get()
    aid = _agency_id(user)
    conn = await db.publishing_connections.find_one({"id": conn_id, "agency_id": aid}, {"portal_slug": 1})
    if not conn:
        raise HTTPException(status_code=404, detail="connection_not_found")
    logs = await db.publishing_sync_logs.find(
        {"agency_id": aid, "portal_slug": conn["portal_slug"]}, {"_id": 0}
    ).sort("started_at", -1).limit(min(max(limit, 1), 100)).to_list(100)
    return {"items": logs, "total": len(logs)}


# ---------- COMPLIANCE (HARD, D-052 + D-053) ----------

def is_publishable(prop: dict) -> tuple:
    """Backwards-compatible wrapper around shared.validators.compliance.

    Kept as a module-level export so existing imports (tests, feed generator)
    keep working. All logic lives in shared/validators/compliance.py now.
    """
    return _validator_is_publishable(prop)


# ---------- M2.6b — SYNC ENDPOINTS ----------

@router.post("/connections/{conn_id}/sync-now")
async def sync_now(
    conn_id: str,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    """Trigger a manual sync for one connection. No retry (snappy response)."""
    db = Database.get()
    aid = _agency_id(user)
    conn = await db.publishing_connections.find_one({"id": conn_id, "agency_id": aid})
    if not conn:
        raise HTTPException(status_code=404, detail="connection_not_found")
    if conn.get("status") == "disabled":
        raise HTTPException(status_code=409, detail="connection_disabled")
    from apps.immoweb.sync_engine import sync_connection_with_retry
    result = await sync_connection_with_retry(conn, trigger="manual")
    return {
        "ok": result.get("ok"),
        "publishable": result.get("publishable_count", 0),
        "blocked": result.get("blocked_count", 0),
        "integration_type": result.get("integration_type"),
        "log": result.get("log"),
    }


@router.get("/connections/{conn_id}/compliance")
async def connection_compliance(
    conn_id: str,
    user: dict = Depends(require_roles("agency_admin", "super_admin")),
):
    """Aggregated compliance snapshot for the agency behind this connection.

    Returns which properties would be blocked / warned if we synced right now.
    Useful to show a "5 immobili non pubblicabili" alert on the dashboard.
    """
    db = Database.get()
    aid = _agency_id(user)
    conn = await db.publishing_connections.find_one({"id": conn_id, "agency_id": aid})
    if not conn:
        raise HTTPException(status_code=404, detail="connection_not_found")
    props = await db.properties.find(
        {"agency_id": aid, "status": "active"}, {"_id": 0}
    ).limit(2000).to_list(2000)
    summary = summarize_agency_compliance(props)
    # Also give the per-property status for the top 20 blocked ones (so the UI
    # can list them with a "vai a correggere" link).
    blocked_details = []
    for p in props:
        r = validate_property(p)
        if not r["publishable"]:
            blocked_details.append({
                "id": p.get("id"),
                "reference": p.get("reference_code"),
                "title": p.get("title") or "",
                "reasons": r["hard_violations"],
            })
            if len(blocked_details) >= 20:
                break
    return {
        "portal_slug": conn["portal_slug"],
        "summary": summary,
        "blocked_details": blocked_details,
    }


@router.post("/sync/run-all")
async def sync_run_all(user: dict = Depends(require_roles("super_admin"))):
    """Admin trigger to run all active syncs immediately (bypasses scheduler)."""
    from apps.immoweb.sync_engine import run_all_active_syncs
    return await run_all_active_syncs(trigger="admin_manual")


# ---------- FEED GENERATOR (public, no auth) ----------

feed_router = APIRouter(prefix="/publishing/feed", tags=["publishing-feed"])


@feed_router.get("/{agency_slug}.xml")
async def portals_feed(agency_slug: str, dialect: str = "osf_federata") -> Response:
    db = Database.get()
    agency = await db.agencies.find_one({"slug": agency_slug, "is_active": True})
    if not agency:
        raise HTTPException(status_code=404, detail="agency_not_found")
    props = await db.properties.find(
        {"agency_id": agency["id"], "status": "active"}
    ).limit(2000).to_list(2000)
    publishable = [p for p in props if is_publishable(p)[0]]
    xml = _render_generic_rss(publishable, agency) if dialect == "generic_rss" \
        else _render_osf_federata(publishable, agency)
    return Response(content=xml, media_type="application/xml; charset=utf-8",
                    headers={"Cache-Control": "public, max-age=1800"})


def _slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def _render_osf_federata(props: List[dict], agency: dict) -> str:
    now = datetime.now(timezone.utc).isoformat()
    parts = ['<?xml version="1.0" encoding="UTF-8"?>', "<feed>",
             f"  <agency><name>{xml_escape(agency.get('display_name',''))}</name>"
             f"<slug>{xml_escape(agency.get('slug',''))}</slug></agency>",
             f"  <generated_at>{now}</generated_at>",
             f"  <total>{len(props)}</total>", "  <properties>"]
    for p in props:
        photos_xml = "".join(
            f'<photo url="{xml_escape(ph.get("url",""))}" order="{i}"/>'
            for i, ph in enumerate(p.get("photos") or []))
        energy = (p.get("energy") or {}).get("energy_class") or ""
        parts.append(
            f'    <property id="{xml_escape(p["id"])}">'
            f'<reference>{xml_escape(p.get("reference_code") or "")}</reference>'
            f'<title>{xml_escape(p.get("title") or "")}</title>'
            f'<type>{xml_escape(p.get("property_type") or "")}</type>'
            f'<operation>{xml_escape(p.get("operation") or "sale")}</operation>'
            f'<city>{xml_escape(p.get("city") or "")}</city>'
            f'<province>{xml_escape(p.get("province") or "")}</province>'
            f'<price>{p.get("price") or ""}</price>'
            f'<rent_monthly>{p.get("rent_monthly") or ""}</rent_monthly>'
            f'<surface_sqm>{p.get("surface_sqm") or ""}</surface_sqm>'
            f'<rooms>{p.get("rooms") or ""}</rooms>'
            f'<bathrooms>{p.get("bathrooms") or ""}</bathrooms>'
            f'<energy_class>{xml_escape(energy)}</energy_class>'
            f'<description>{xml_escape((p.get("description") or "")[:2000])}</description>'
            f'<photos>{photos_xml}</photos>'
            f'</property>')
    parts.extend(["  </properties>", "</feed>"])
    return "\n".join(parts)


def _render_generic_rss(props: List[dict], agency: dict) -> str:
    now = datetime.now(timezone.utc).isoformat()
    parts = ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0"><channel>',
             f"<title>{xml_escape(agency.get('display_name',''))}</title>",
             f"<link>https://omnia.re/agencies/{xml_escape(agency.get('slug',''))}</link>",
             f"<description>Feed immobili</description>",
             f"<lastBuildDate>{now}</lastBuildDate>"]
    for p in props:
        price = p.get("price") or p.get("rent_monthly") or 0
        parts.append(
            f"<item><guid isPermaLink=\"false\">{xml_escape(p['id'])}</guid>"
            f"<title>{xml_escape(p.get('title') or '')} - {price} EUR</title>"
            f"<link>https://omnia.re/p/{xml_escape(p['id'])}</link>"
            f"<description>{xml_escape((p.get('description') or '')[:500])}</description></item>")
    parts.append("</channel></rss>")
    return "\n".join(parts)
