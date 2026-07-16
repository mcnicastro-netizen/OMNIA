"""OMNIA — Publishing Center router (M2.6a, D-052).

New multi-portal outbound publishing layer. Coexists with legacy portals.py
(M2.S5 "portal subscriptions" concept, kept intact).

Endpoints under /api/app/publishing:
    GET    /catalog                     list of supported portals (OMNIA-curated)
    GET    /connections                 my agency's activations
    POST   /connections                 activate a portal
    PATCH  /connections/{id}            update creds / toggle
    DELETE /connections/{id}            deactivate
    GET    /connections/{id}/logs       recent sync logs
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


# ---------- COMPLIANCE (HARD, D-052) ----------

def is_publishable(prop: dict) -> tuple:
    reasons: list = []
    op = prop.get("operation", "sale")
    if op == "sale" and not prop.get("price"):
        reasons.append("missing_price")
    if op == "rent" and not prop.get("rent_monthly"):
        reasons.append("missing_rent")
    if not (prop.get("energy") or {}).get("energy_class"):
        reasons.append("missing_energy_class")
    if len([p for p in (prop.get("photos") or []) if p.get("url")]) < 3:
        reasons.append("less_than_3_photos")
    return (len(reasons) == 0, reasons)


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
