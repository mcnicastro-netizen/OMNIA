"""OMNIA — ImmobilCloud B2C Public Portal (M3.S1).

Aggregates all `status=active` + `visibility=public` + `is_listed_on_immobilcloud=true`
properties from ALL OMNIA agencies and exposes them through public, NO-AUTH endpoints.

Mounted at `/api/cloud/*`. Hostname `cloud.omniarealestateecosystem.it` will be
routed here by the platform reverse proxy + a public React app served on the
same domain consuming these endpoints.

Endpoints (PUBLIC, NO AUTH):
  GET  /search       — filtered+paginated property list
  GET  /facets       — counters for the filter UI (cities/types/operations)
  GET  /property/{id} — single property detail
  GET  /property/{id}/agency — public agency card (display_name, slug, city)

Photos are served by the existing endpoint /api/public/property/{pid}/photo/{idx}.
"""
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr, Field

from shared.db.connection import Database

logger = logging.getLogger("omnia.immobilcloud")
router = APIRouter(tags=["immobilcloud"])


# ============================================================
# Helpers
# ============================================================

PUBLIC_FIELDS = {
    "_id": 0,
    "owner": 0,                # internal-only
    "seller_client_id": 0,     # internal-only
    "commission_pct": 0,
    "listing_agent_id": 0,
    "lead_count": 0,
    "view_count": 0,
}

LIST_FIELDS = {
    "_id": 0,
    "id": 1, "agency_id": 1, "title": 1, "description": 1,
    "property_type": 1, "operation": 1, "status": 1,
    "city": 1, "zone": 1, "address": 1,
    "lat": 1, "lng": 1,
    "price": 1, "rent_monthly": 1,
    "surface_sqm": 1, "rooms": 1, "bedrooms": 1, "bathrooms": 1,
    "floor": 1, "energy": 1,
    "photos": 1, "features": 1,
    "updated_at": 1, "created_at": 1,
    "reference_code": 1,
}


def _base_filter() -> Dict[str, Any]:
    """Common visibility filter applied to every public query."""
    return {
        "status": "active",
        "visibility": "public",
        "is_listed_on_immobilcloud": {"$ne": False},
    }


def _cover_photo(photos: Optional[List[dict]]) -> Optional[str]:
    if not photos:
        return None
    idx = next((i for i, p in enumerate(photos) if p.get("is_cover")), 0)
    return f"/api/public/property/{photos[idx].get('property_id') or ''}/photo/{idx}".replace("//photo/", "/photo/")


def _to_card(p: Dict[str, Any], agency: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Public list card payload."""
    photos = p.get("photos") or []
    cover_idx = next((i for i, ph in enumerate(photos) if ph.get("is_cover")), 0 if photos else None)
    return {
        "id": p["id"],
        "title": p.get("title"),
        "property_type": p.get("property_type"),
        "operation": p.get("operation"),
        "city": p.get("city"),
        "zone": p.get("zone"),
        "lat": p.get("lat"),
        "lng": p.get("lng"),
        "price": p.get("price"),
        "rent_monthly": p.get("rent_monthly"),
        "surface_sqm": p.get("surface_sqm"),
        "rooms": p.get("rooms"),
        "bedrooms": p.get("bedrooms"),
        "bathrooms": p.get("bathrooms"),
        "energy_class": (p.get("energy") or {}).get("energy_class"),
        "cover_url": f"/api/public/property/{p['id']}/photo/{cover_idx}" if cover_idx is not None else None,
        "photo_count": len(photos),
        "reference_code": p.get("reference_code"),
        "updated_at": p.get("updated_at"),
        "agency": {
            "id": agency.get("id") if agency else None,
            "name": agency.get("display_name") if agency else None,
            "slug": agency.get("slug") if agency else None,
        } if agency else None,
    }


# ============================================================
# 1) Search — main list endpoint
# ============================================================

@router.get("/search")
async def public_search(
    q: Optional[str] = None,
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    operation: Optional[str] = Query(None, pattern="^(sale|rent)$"),
    price_min: Optional[int] = Query(None, ge=0),
    price_max: Optional[int] = Query(None, ge=0),
    surface_min: Optional[int] = Query(None, ge=0),
    surface_max: Optional[int] = Query(None, ge=0),
    rooms_min: Optional[int] = Query(None, ge=0),
    bedrooms_min: Optional[int] = Query(None, ge=0),
    bathrooms_min: Optional[int] = Query(None, ge=0),
    energy_class: Optional[str] = Query(None, pattern="^(A4|A3|A2|A1|A|B|C|D|E|F|G)$"),
    sort: str = Query("recent", pattern="^(recent|price_asc|price_desc|surface_desc)$"),
    page: int = Query(1, ge=1, le=500),
    page_size: int = Query(20, ge=1, le=60),
):
    """Public paginated listing filtered by common B2C criteria."""
    db = Database.get()
    flt: Dict[str, Any] = _base_filter()

    if city:
        flt["city"] = {"$regex": f"^{city}", "$options": "i"}
    if property_type:
        flt["property_type"] = property_type
    if operation:
        flt["operation"] = operation
    if rooms_min:
        flt["rooms"] = {"$gte": rooms_min}
    if bedrooms_min:
        flt["bedrooms"] = {"$gte": bedrooms_min}
    if bathrooms_min:
        flt["bathrooms"] = {"$gte": bathrooms_min}
    if energy_class:
        flt["energy.energy_class"] = energy_class
    if surface_min or surface_max:
        rng = {}
        if surface_min:
            rng["$gte"] = surface_min
        if surface_max:
            rng["$lte"] = surface_max
        flt["surface_sqm"] = rng
    if price_min or price_max:
        rng = {}
        if price_min:
            rng["$gte"] = price_min
        if price_max:
            rng["$lte"] = price_max
        # price for sale; rent_monthly for rent
        if operation == "rent":
            flt["rent_monthly"] = rng
        else:
            flt["price"] = rng
    if q:
        flt["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"city": {"$regex": q, "$options": "i"}},
            {"zone": {"$regex": q, "$options": "i"}},
        ]

    # Sort
    sort_map = {
        "recent": [("updated_at", -1)],
        "price_asc": [("price", 1), ("rent_monthly", 1)],
        "price_desc": [("price", -1), ("rent_monthly", -1)],
        "surface_desc": [("surface_sqm", -1)],
    }
    sort_spec = sort_map[sort]

    total = await db.properties.count_documents(flt)
    skip = (page - 1) * page_size
    cursor = db.properties.find(flt, LIST_FIELDS).sort(sort_spec).skip(skip).limit(page_size)
    props = await cursor.to_list(length=page_size)

    # Batch-resolve agencies
    agency_ids = list({p.get("agency_id") for p in props if p.get("agency_id")})
    agencies: Dict[str, Dict[str, Any]] = {}
    if agency_ids:
        async for a in db.agencies.find(
            {"id": {"$in": agency_ids}, "is_active": True},
            {"_id": 0, "id": 1, "slug": 1, "display_name": 1},
        ):
            agencies[a["id"]] = a

    return {
        "items": [_to_card(p, agencies.get(p.get("agency_id"))) for p in props],
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_next": skip + page_size < total,
        "sort": sort,
    }


# ============================================================
# 2) Facets — counters for filter UI
# ============================================================

@router.get("/map")
async def public_map_markers(
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    operation: Optional[str] = Query(None, pattern="^(sale|rent)$"),
    price_min: Optional[int] = Query(None, ge=0),
    price_max: Optional[int] = Query(None, ge=0),
    rooms_min: Optional[int] = Query(None, ge=0),
    bedrooms_min: Optional[int] = Query(None, ge=0),
    energy_class: Optional[str] = Query(None, pattern="^(A4|A3|A2|A1|A|B|C|D|E|F|G)$"),
    bbox: Optional[str] = Query(None, description="south,west,north,east"),
    limit: int = Query(500, ge=1, le=2000),
):
    """M3.S3 — Lightweight markers for map view. Returns only id/lat/lng/price/type
    of properties with coordinates. Optional bbox filter (south,west,north,east).
    """
    db = Database.get()
    flt: Dict[str, Any] = _base_filter()
    # Required: must have coordinates
    flt["lat"] = {"$ne": None, "$exists": True}
    flt["lng"] = {"$ne": None, "$exists": True}

    if city:
        flt["city"] = {"$regex": f"^{city}", "$options": "i"}
    if property_type:
        flt["property_type"] = property_type
    if operation:
        flt["operation"] = operation
    if rooms_min:
        flt["rooms"] = {"$gte": rooms_min}
    if bedrooms_min:
        flt["bedrooms"] = {"$gte": bedrooms_min}
    if energy_class:
        flt["energy.energy_class"] = energy_class
    if price_min or price_max:
        rng = {}
        if price_min:
            rng["$gte"] = price_min
        if price_max:
            rng["$lte"] = price_max
        if operation == "rent":
            flt["rent_monthly"] = rng
        else:
            flt["price"] = rng

    # Bounding box filter (south, west, north, east)
    if bbox:
        try:
            south, west, north, east = (float(x) for x in bbox.split(","))
            flt["lat"] = {"$gte": south, "$lte": north}
            flt["lng"] = {"$gte": west, "$lte": east}
        except (ValueError, AttributeError):
            raise HTTPException(status_code=400, detail="invalid_bbox_format")

    cursor = db.properties.find(
        flt,
        {"_id": 0, "id": 1, "lat": 1, "lng": 1, "price": 1, "rent_monthly": 1,
         "property_type": 1, "operation": 1, "city": 1, "title": 1},
    ).limit(limit)
    items = await cursor.to_list(length=limit)
    return {"items": items, "count": len(items)}


@router.get("/facets")
async def public_facets(
    operation: Optional[str] = Query(None, pattern="^(sale|rent)$"),
):
    """Returns top cities & property types with counts (for hero search box)."""
    db = Database.get()
    flt = _base_filter()
    if operation:
        flt["operation"] = operation

    # Top 20 cities
    cities_cur = db.properties.aggregate([
        {"$match": flt},
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20},
    ])
    cities = [{"city": d["_id"], "count": d["count"]} async for d in cities_cur if d["_id"]]

    types_cur = db.properties.aggregate([
        {"$match": flt},
        {"$group": {"_id": "$property_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ])
    types = [{"type": d["_id"], "count": d["count"]} async for d in types_cur if d["_id"]]

    total = await db.properties.count_documents(flt)

    return {
        "total_active": total,
        "cities": cities,
        "property_types": types,
    }


# ============================================================
# 3) Detail — single property
# ============================================================

@router.get("/property/{pid}")
async def public_property_detail(pid: str):
    db = Database.get()
    p = await db.properties.find_one(
        {"id": pid, **_base_filter()},
        PUBLIC_FIELDS,
    )
    if not p:
        raise HTTPException(status_code=404, detail="property_not_found")

    agency = None
    if p.get("agency_id"):
        agency = await db.agencies.find_one(
            {"id": p["agency_id"], "is_active": True},
            {"_id": 0, "id": 1, "slug": 1, "display_name": 1, "logo_url": 1,
             "phone": 1, "email": 1, "city": 1},
        )

    # Bump view counter (best-effort)
    try:
        await db.properties.update_one({"id": pid}, {"$inc": {"view_count": 1}})
    except Exception:
        pass

    photos = p.get("photos") or []
    return {
        **{k: v for k, v in p.items() if k != "photos"},
        "photos": [
            {
                "url": f"/api/public/property/{pid}/photo/{i}",
                "is_cover": ph.get("is_cover", False),
                "caption": ph.get("caption"),
            }
            for i, ph in enumerate(photos)
        ],
        "agency": agency,
    }


# ============================================================
# 4) Agency public card
# ============================================================

@router.get("/agency/{slug}")
async def public_agency_card(slug: str):
    db = Database.get()
    a = await db.agencies.find_one(
        {"slug": slug, "is_active": True},
        {"_id": 0, "id": 1, "slug": 1, "display_name": 1, "logo_url": 1,
         "phone": 1, "email": 1, "city": 1, "address": 1, "description": 1},
    )
    if not a:
        raise HTTPException(status_code=404, detail="agency_not_found")
    # Count of public properties of this agency
    count = await db.properties.count_documents({
        "agency_id": a["id"], **_base_filter(),
    })
    return {**a, "public_property_count": count}


# ============================================================
# 5) Contact form — generates a Lead in the agency CRM (M3.S4)
# ============================================================

class PropertyContactPayload(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    surname: Optional[str] = Field(default=None, max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    message: str = Field(min_length=10, max_length=2000)
    gdpr_consent: bool = False
    visit_requested: bool = False  # optional checkbox "richiedi visita"


@router.post("/property/{pid}/contact")
async def public_property_contact(pid: str, payload: PropertyContactPayload):
    """B2C contact form. Creates (or reuses) a client in the agency CRM and
    a Lead linking it to this property. Source = 'ImmobilCloud'.
    """
    if not payload.gdpr_consent:
        raise HTTPException(status_code=400, detail="gdpr_consent_required")

    db = Database.get()
    prop = await db.properties.find_one(
        {"id": pid, **_base_filter()},
        {"_id": 0, "id": 1, "agency_id": 1, "title": 1},
    )
    if not prop:
        raise HTTPException(status_code=404, detail="property_not_found")

    agency_id = prop.get("agency_id")
    if not agency_id:
        raise HTTPException(status_code=409, detail="property_has_no_agency")

    now = datetime.now(timezone.utc).isoformat()

    # 1) Find or create client
    existing = await db.clients.find_one(
        {"agency_id": agency_id, "email": payload.email.lower()},
        {"_id": 0, "id": 1},
    )
    if existing:
        client_id = existing["id"]
        # Refresh updated_at + last source if reused
        await db.clients.update_one(
            {"id": client_id},
            {"$set": {"updated_at": now}, "$setOnInsert": {}},
        )
    else:
        client_id = str(uuid4())
        await db.clients.insert_one({
            "id": client_id,
            "agency_id": agency_id,
            "name": payload.name,
            "surname": payload.surname,
            "email": payload.email.lower(),
            "phone": payload.phone,
            "whatsapp": None,
            "fiscal_code": None,
            "client_type": "buyer",
            "status": "new",
            "source": "ImmobilCloud",
            "assigned_agent_id": None,
            "preferences": {},
            "notes": None,
            "gdpr_consent": True,
            "created_at": now,
            "updated_at": now,
        })

    # 2) Create lead
    lead_id = str(uuid4())
    note_lines = [payload.message.strip()]
    if payload.visit_requested:
        note_lines.append("[richiesta visita immobile]")
    await db.leads.insert_one({
        "id": lead_id,
        "agency_id": agency_id,
        "client_id": client_id,
        "property_id": pid,
        "status": "new",
        "score": None,
        "notes": "\n".join(note_lines),
        "assigned_agent_id": None,
        "source": "ImmobilCloud",
        "created_at": now,
        "updated_at": now,
    })

    # 3) Bump property lead counter (best-effort)
    try:
        await db.properties.update_one({"id": pid}, {"$inc": {"lead_count": 1}})
    except Exception:
        pass

    logger.info("B2C contact: lead=%s client=%s property=%s agency=%s",
                lead_id, client_id, pid, agency_id)
    return {"ok": True, "lead_id": lead_id, "client_id": client_id}
