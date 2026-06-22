"""OMNIA — GIS Property Valuator (M3.S6).

Public, no-auth endpoint that estimates the market value of a residential
property in Italy based on:
  - City + zone tier (centro / semicentro / periferia)
  - Property type (appartamento, villa, attico, ...)
  - Surface in m²
  - Condition (nuovo, buono, da_ristrutturare, ...)
  - Energy class (optional)
  - Other adjustments (floor, elevator, lift impact — future)

Output: a range (min/avg/max) total value + €/m² + a confidence score +
methodology + data source + comparables count when available.

Algorithm overview (deterministic, auditable):

  1. Normalize city name → lookup table key (lowercase, ASCII, snake_case)
  2. Resolve zone tier: explicit user input OR heuristic from address keywords
     (centro storico, centro, semicentro, periferia, ...) OR default "semicentro"
  3. Read base €/m² (min, max) from CITY_PRICES; if missing, use regional default
     (REGION_TO_AREA → REGIONAL_DEFAULTS)
  4. Apply multipliers in order: property_type × condition × energy_class
  5. Multiply by surface to get total value range
  6. Compute confidence:
       - high  if city found AND zone explicit AND property_type known AND condition known
       - medium if city found but zone inferred or condition missing
       - low   if city not found (regional fallback) OR property_type unusual
  7. Optionally, query db.properties for comparables in same city + property_type
     to refine the estimate (price_per_sqm of recent active listings)

Endpoint:
  POST /api/cloud/valuator
"""
import logging
import re
import unicodedata
from typing import Any, Dict, List, Literal, Optional, Tuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from shared.db.connection import Database
from apps.immocloud.data.italy_real_estate_prices_2025 import (
    CITY_PRICES,
    REGION_TO_AREA,
    REGIONAL_DEFAULTS,
    PROPERTY_TYPE_MULTIPLIER,
    CONDITION_MULTIPLIER,
    ENERGY_CLASS_MULTIPLIER,
)

logger = logging.getLogger("omnia.valuator")
router = APIRouter(prefix="/valuator", tags=["cloud-valuator"])

ZoneTier = Literal["centro", "semicentro", "periferia"]


# ----------- Normalization helpers ------------

def _normalize_city(name: str) -> str:
    """Lowercase, strip accents, replace spaces/special with underscores."""
    if not name:
        return ""
    n = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    n = n.lower().strip()
    n = re.sub(r"[\s\-'`]+", "_", n)
    n = re.sub(r"[^a-z0-9_]", "", n)
    return n


# Common synonyms / mis-spellings → canonical key
CITY_SYNONYMS = {
    "milan": "milano",
    "rome": "roma",
    "florence": "firenze",
    "naples": "napoli",
    "venice": "venezia",
    "turin": "torino",
    "genoa": "genova",
    "padua": "padova",
    "forli_cesena": "forli",
    "forlì": "forli",
    "lecco_città": "lecco",
    "monza_brianza": "monza",
    "monza_e_brianza": "monza",
    "carrara": "massa",
    "barletta_andria_trani": "barletta",
    "reggio_di_calabria": "reggio_calabria",
    "reggio_nell_emilia": "reggio_emilia",
    "la_spezia_città": "la_spezia",
    "l_aquila_città": "l_aquila",
    "laquila": "l_aquila",
    "aquila": "l_aquila",
}


def _resolve_city_key(city_raw: str) -> Optional[str]:
    key = _normalize_city(city_raw)
    if not key:
        return None
    if key in CITY_PRICES:
        return key
    if key in CITY_SYNONYMS:
        return CITY_SYNONYMS[key]
    # Try partial match (e.g., "milano_2" → "milano")
    for canonical in CITY_PRICES:
        if key.startswith(canonical + "_") or canonical.startswith(key + "_"):
            return canonical
    return None


# Heuristic zone tier inference from free-text address/zone
ZONE_TIER_KEYWORDS = {
    "centro": [
        "centro storico", "centro", "centrale", "duomo", "navigli",
        "trastevere", "spagna", "campo de fiori", "chiaia", "vomero",
        "santo stefano", "centro città",
    ],
    "semicentro": [
        "semicentro", "semicentrale", "porta", "stazione",
        "fiera", "università", "city life", "isola", "porta romana",
        "porta venezia", "san paolo", "san donato",
    ],
    "periferia": [
        "periferia", "periferico", "ext", "fuori", "hinterland",
        "tor bella monaca", "scampia", "secondigliano", "quarto",
        "metropolitano", "borgata",
    ],
}


def _infer_zone_tier(zone_text: Optional[str], address: Optional[str]) -> Tuple[ZoneTier, bool]:
    """Return (tier, explicit_user_input). If we can't infer, default 'semicentro'."""
    if zone_text:
        z = zone_text.lower().strip()
        if z in ("centro", "semicentro", "periferia"):
            return z, True
    haystack = " ".join(filter(None, [zone_text, address])).lower()
    for tier, keywords in ZONE_TIER_KEYWORDS.items():
        for kw in keywords:
            if kw in haystack:
                return tier, False  # inferred — not explicit
    return "semicentro", False


# ----------- Core valuation function ------------

class ValuationPayload(BaseModel):
    city: str = Field(min_length=2, max_length=100)
    zone: Optional[str] = Field(default=None, max_length=200)
    address: Optional[str] = Field(default=None, max_length=300)
    property_type: str = Field(default="appartamento", max_length=50)
    surface_sqm: int = Field(ge=10, le=10000)
    condition: Optional[str] = Field(default="buono", max_length=50)
    energy_class: Optional[str] = Field(default=None, pattern="^(A4|A3|A2|A1|A|B|C|D|E|F|G)?$")
    floor: Optional[int] = Field(default=None, ge=-2, le=80)
    # Optional: capture lead intent
    email: Optional[str] = Field(default=None, max_length=200)
    name: Optional[str] = Field(default=None, max_length=200)


@router.post("")
async def estimate_value(payload: ValuationPayload) -> Dict[str, Any]:
    """Estimate the market value range for a residential property."""
    city_key = _resolve_city_key(payload.city)
    city_data = CITY_PRICES.get(city_key) if city_key else None

    zone_tier, zone_explicit = _infer_zone_tier(payload.zone, payload.address)

    if city_data:
        base_min, base_max = city_data[zone_tier]
        region = city_data.get("region")
        data_source = city_data.get("source", "Borsino/OMI 2025 curated")
    else:
        # Regional fallback (e.g., user typed a small town not in our dataset)
        # Try to infer region from explicit hint, else default
        region = None
        base_min, base_max = REGIONAL_DEFAULTS["center"]
        data_source = "Regional fallback (city not in curated dataset)"

    # Property type multiplier
    ptype_mult = PROPERTY_TYPE_MULTIPLIER.get(payload.property_type, 0.90)
    # Condition multiplier
    cond_mult = CONDITION_MULTIPLIER.get(payload.condition or "buono", 1.00)
    # Energy class multiplier
    energy_mult = ENERGY_CLASS_MULTIPLIER.get(payload.energy_class, 1.00) if payload.energy_class else 1.00
    # Floor adjustment: top floor / penthouse bonus, ground/basement penalty
    floor_mult = 1.00
    if payload.floor is not None:
        if payload.floor >= 5:
            floor_mult = 1.04
        elif payload.floor <= 0:
            floor_mult = 0.95
        elif payload.floor == 1:
            floor_mult = 0.98

    total_mult = ptype_mult * cond_mult * energy_mult * floor_mult

    # Final €/m² range
    psm_min = round(base_min * total_mult)
    psm_max = round(base_max * total_mult)
    psm_avg = round((psm_min + psm_max) / 2)

    # Total values
    value_min = psm_min * payload.surface_sqm
    value_max = psm_max * payload.surface_sqm
    value_avg = psm_avg * payload.surface_sqm

    # Confidence scoring
    confidence_score = 0
    if city_data:
        confidence_score += 50
    if zone_explicit:
        confidence_score += 20
    if payload.property_type in PROPERTY_TYPE_MULTIPLIER:
        confidence_score += 10
    if payload.condition and payload.condition in CONDITION_MULTIPLIER:
        confidence_score += 10
    if payload.energy_class:
        confidence_score += 5
    if payload.address:
        confidence_score += 5

    if confidence_score >= 80:
        confidence = "high"
    elif confidence_score >= 55:
        confidence = "medium"
    else:
        confidence = "low"

    # Comparables (active listings in same city + property type)
    comparables = []
    comparable_count = 0
    if city_key:
        db = Database.get()
        try:
            cursor = db.properties.find({
                "status": "active",
                "visibility": "public",
                "moderation_status": {"$nin": ["pending", "rejected"]},
                "property_type": payload.property_type,
                "city": {"$regex": f"^{payload.city}", "$options": "i"},
                "price": {"$gt": 0},
                "surface_sqm": {"$gt": 0},
            }, {
                "_id": 0, "id": 1, "title": 1, "price": 1, "surface_sqm": 1,
                "rooms": 1, "city": 1, "zone": 1,
            }).limit(20)
            comps = await cursor.to_list(length=20)
            for c in comps:
                if c["surface_sqm"] > 0:
                    c["price_per_sqm"] = round(c["price"] / c["surface_sqm"])
                    comparables.append(c)
            comparable_count = len(comparables)
        except Exception as e:
            logger.warning("comparables query failed: %s", e)

    # Best-effort capture of a "valuation lead" when user provides email
    lead_id = None
    if payload.email and payload.name and city_key:
        try:
            from datetime import datetime, timezone
            from uuid import uuid4
            db = Database.get()
            now = datetime.now(timezone.utc).isoformat()
            lead_id = str(uuid4())
            await db.valuation_leads.insert_one({
                "id": lead_id,
                "name": payload.name,
                "email": payload.email.lower(),
                "city": payload.city,
                "zone": payload.zone,
                "address": payload.address,
                "property_type": payload.property_type,
                "surface_sqm": payload.surface_sqm,
                "condition": payload.condition,
                "energy_class": payload.energy_class,
                "estimated_value_min": value_min,
                "estimated_value_max": value_max,
                "estimated_value_avg": value_avg,
                "created_at": now,
                "source": "ImmobilCloud-Valuator",
            })
        except Exception as e:
            logger.warning("valuation lead capture failed: %s", e)
            lead_id = None

    return {
        "ok": True,
        "city_resolved": city_key,
        "city_in_dataset": city_data is not None,
        "region": region,
        "zone_tier": zone_tier,
        "zone_explicit": zone_explicit,
        "price_per_sqm": {
            "min": psm_min, "avg": psm_avg, "max": psm_max,
        },
        "estimated_value": {
            "min": value_min, "avg": value_avg, "max": value_max,
        },
        "currency": "EUR",
        "surface_sqm": payload.surface_sqm,
        "multipliers_applied": {
            "property_type": ptype_mult,
            "condition": cond_mult,
            "energy_class": energy_mult,
            "floor": floor_mult,
            "total": round(total_mult, 4),
        },
        "confidence": confidence,
        "confidence_score": confidence_score,
        "methodology": (
            "Stima basata su benchmark di mercato 2025 per la città e zona indicate, "
            "corretti per tipologia immobiliare, condizione, classe energetica e piano. "
            f"Algoritmo: base_€/m²_{zone_tier} × tipologia({ptype_mult}) × "
            f"condizione({cond_mult}) × classe_en({energy_mult}) × piano({floor_mult}) × superficie."
        ),
        "data_source": data_source,
        "comparable_count": comparable_count,
        "comparables": comparables[:10],
        "valuation_lead_id": lead_id,
        "disclaimer": (
            "Stima orientativa basata su dati statistici di mercato. Per una valutazione "
            "vincolante richiedi una perizia ufficiale a un agente OMNIA certificato."
        ),
    }


@router.get("/coverage")
async def coverage_info():
    """Public info endpoint: how many cities are in the dataset."""
    return {
        "cities_covered": len(CITY_PRICES),
        "regions_covered": len(set(c.get("region") for c in CITY_PRICES.values() if c.get("region"))),
        "zone_tiers": ["centro", "semicentro", "periferia"],
        "property_types": list(PROPERTY_TYPE_MULTIPLIER.keys()),
        "conditions": list(CONDITION_MULTIPLIER.keys()),
        "data_year": 2025,
    }
