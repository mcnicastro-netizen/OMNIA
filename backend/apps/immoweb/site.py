"""OMNIA — Public Site-as-Feed (M2.S5 Layer C).

Server-rendered HTML pages for agency property portfolio. Designed for SEO &
external crawlers (Idealista, Google, social shares).

Endpoints (public, NO auth):
  GET /api/public/property/{pid}/photo/{i}  → binary JPEG (resolves base64)
  GET /api/p/{slug}/sitemap.xml             → XML sitemap of all active props
  GET /api/p/{slug}/                        → agency listings index
  GET /api/p/{slug}/{pid}                   → single property page (schema.org RealEstateListing)
"""
import base64
from datetime import datetime, timezone
from html import escape
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Response

from shared.db.connection import Database

router = APIRouter(tags=["public-site"])


# ---------------- Binary photo serving ----------------

@router.get("/public/property/{pid}/photo/{idx}")
async def serve_property_photo(pid: str, idx: int):
    """Return one property photo as binary image. Resolves base64 stored in Mongo.
    M3 will migrate to S3 → this endpoint becomes a 302 redirect.
    """
    db = Database.get()
    p = await db.properties.find_one(
        {"id": pid, "status": "active"}, {"_id": 0, "photos": 1},
    )
    if not p:
        raise HTTPException(status_code=404, detail="property_not_found")
    photos = p.get("photos") or []
    if idx < 0 or idx >= len(photos):
        raise HTTPException(status_code=404, detail="photo_not_found")
    raw = photos[idx].get("url") or ""
    # Accept both "data:image/jpeg;base64,..." and bare base64
    if raw.startswith("data:"):
        try:
            header, b64 = raw.split(",", 1)
            mime = header.split(";")[0].split(":")[1] or "image/jpeg"
        except (ValueError, IndexError):
            raise HTTPException(status_code=500, detail="invalid_photo_data")
    else:
        mime = "image/jpeg"
        b64 = raw
    try:
        binary = base64.b64decode(b64)
    except Exception:
        raise HTTPException(status_code=500, detail="decode_failed")
    return Response(
        content=binary, media_type=mime,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------------- HTML helpers ----------------

def _eur(v: Optional[float]) -> str:
    if v is None:
        return "—"
    try:
        return f"€ {int(v):,}".replace(",", ".")
    except Exception:
        return f"€ {v}"


async def _resolve(slug: str) -> Dict[str, Any]:
    db = Database.get()
    a = await db.agencies.find_one({"slug": slug, "is_active": True}, {"_id": 0})
    if not a:
        raise HTTPException(status_code=404, detail="agency_not_found")
    return a


def _base_css() -> str:
    return """
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c1917;background:#fafaf9;line-height:1.55}
    a{color:#1c1917;text-decoration:none}
    a:hover{text-decoration:underline}
    .container{max-width:1080px;margin:0 auto;padding:24px}
    header{background:#fff;border-bottom:1px solid #e7e5e4;padding:18px 0}
    h1{font-family:'Georgia',serif;font-size:2.2rem;line-height:1.15;margin-bottom:.5rem}
    h2{font-family:'Georgia',serif;font-size:1.5rem;margin:1.5rem 0 1rem}
    .meta{color:#78716c;font-size:.9rem;margin-bottom:1.2rem}
    .price{font-size:2rem;font-weight:600;color:#1f6b5c}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin:1.5rem 0}
    .grid > div{background:#fff;border:1px solid #e7e5e4;border-radius:6px;padding:12px}
    .grid label{display:block;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#78716c;margin-bottom:.3rem}
    .grid strong{font-size:1.05rem;color:#1c1917}
    .photos{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;margin:1.5rem 0}
    .photos img{width:100%;height:200px;object-fit:cover;border-radius:6px;border:1px solid #e7e5e4}
    .description{background:#fff;border:1px solid #e7e5e4;border-radius:6px;padding:1.5rem;white-space:pre-wrap;margin:1.5rem 0}
    .features{display:flex;flex-wrap:wrap;gap:8px;margin:1rem 0}
    .features span{background:#fff;border:1px solid #d6d3d1;border-radius:999px;padding:4px 12px;font-size:.85rem;color:#57534e}
    .card{background:#fff;border:1px solid #e7e5e4;border-radius:6px;padding:18px;margin:8px 0}
    .listings{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:1.5rem}
    .listings a{display:block;background:#fff;border:1px solid #e7e5e4;border-radius:6px;overflow:hidden;transition:border .2s}
    .listings a:hover{border-color:#1c1917;text-decoration:none}
    .listings .body{padding:12px}
    .listings .body h3{font-size:1.05rem;margin-bottom:.3rem;font-family:Georgia,serif}
    .listings .body p{color:#78716c;font-size:.85rem;margin-bottom:.5rem}
    .listings .body strong{color:#1f6b5c}
    .listings img{width:100%;height:170px;object-fit:cover;display:block;background:#f5f5f4}
    footer{margin-top:3rem;padding:24px;text-align:center;color:#78716c;font-size:.85rem;border-top:1px solid #e7e5e4}
    """


def _page_shell(title: str, description: str, canonical: str, og_image: Optional[str],
                jsonld: str, body_html: str, agency_name: str) -> str:
    og_img = f'<meta property="og:image" content="{escape(og_image)}"/>' if og_image else ""
    return f"""<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{escape(title)}</title>
<meta name="description" content="{escape(description)}"/>
<link rel="canonical" href="{escape(canonical)}"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="{escape(title)}"/>
<meta property="og:description" content="{escape(description)}"/>
<meta property="og:url" content="{escape(canonical)}"/>
{og_img}
<meta name="generator" content="OMNIA Real Estate Ecosystem"/>
<style>{_base_css()}</style>
<script type="application/ld+json">{jsonld}</script>
</head>
<body>
<header>
  <div class="container"><strong>{escape(agency_name)}</strong></div>
</header>
<main class="container">{body_html}</main>
<footer>Powered by <a href="https://omniarealestateecosystem.it">OMNIA</a></footer>
</body>
</html>"""


# ---------------- Sitemap ----------------

@router.get("/p/{slug}/sitemap.xml")
async def site_sitemap(slug: str):
    agency = await _resolve(slug)
    db = Database.get()
    props = await db.properties.find(
        {"agency_id": agency["id"], "status": "active"},
        {"_id": 0, "id": 1, "updated_at": 1},
    ).to_list(length=5000)
    urls = []
    base = f"/api/p/{slug}"
    urls.append(f"  <url><loc>{base}/</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>")
    for p in props:
        lastmod = (p.get("updated_at") or "")[:10] or datetime.now(timezone.utc).strftime("%Y-%m-%d")
        urls.append(
            f"  <url><loc>{base}/{p['id']}</loc>"
            f"<lastmod>{lastmod}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>"
    )
    return Response(content=xml, media_type="application/xml; charset=utf-8")


# ---------------- Agency listing index ----------------

@router.get("/p/{slug}/", response_class=Response)
async def site_index(slug: str):
    agency = await _resolve(slug)
    db = Database.get()
    props = await db.properties.find(
        {"agency_id": agency["id"], "status": "active"},
        {"_id": 0},
    ).sort("updated_at", -1).to_list(length=200)
    canonical = f"/api/p/{slug}/"
    title = f"{agency.get('display_name')} — Immobili in vendita e affitto"
    desc = (
        f"Portafoglio immobili pubblicato da {agency.get('display_name')}. "
        f"{len(props)} annunci attivi su OMNIA."
    )
    cards = []
    for p in props:
        photos = p.get("photos") or []
        cover_idx = next((i for i, ph in enumerate(photos) if ph.get("is_cover")), 0 if photos else None)
        cover_url = f"/api/public/property/{p['id']}/photo/{cover_idx}" if cover_idx is not None else ""
        price_str = (
            _eur(p.get("price")) if p.get("price") else (
                f"{_eur(p.get('rent_monthly'))}/mese" if p.get("rent_monthly") else "—"
            )
        )
        cards.append(f"""
        <a href="/api/p/{escape(slug)}/{escape(p['id'])}">
          {f'<img src="{escape(cover_url)}" alt="{escape(p.get("title") or "")}"/>' if cover_url else '<div style="height:170px;background:#f5f5f4"></div>'}
          <div class="body">
            <h3>{escape(p.get('title') or '—')}</h3>
            <p>{escape(p.get('city') or '')} · {escape(p.get('property_type') or '')} · {p.get('surface_sqm') or '—'} m² · {p.get('rooms') or '—'} loc.</p>
            <strong>{escape(price_str)}</strong>
          </div>
        </a>""")
    body = f"""
    <h1>{escape(agency.get('display_name'))}</h1>
    <p class="meta">{len(props)} immobili attivi</p>
    <div class="listings">{''.join(cards) or '<p class="meta">Nessun immobile pubblicato al momento.</p>'}</div>
    """
    jsonld = (
        '{"@context":"https://schema.org","@type":"RealEstateAgent","name":"'
        + escape(agency.get('display_name') or "").replace('"', '\\"')
        + '","url":"' + canonical + '"}'
    )
    return Response(
        content=_page_shell(title, desc, canonical, None, jsonld, body, agency.get('display_name') or ""),
        media_type="text/html; charset=utf-8",
    )


# ---------------- Single property page ----------------

@router.get("/p/{slug}/{pid}", response_class=Response)
async def site_property(slug: str, pid: str):
    agency = await _resolve(slug)
    db = Database.get()
    p = await db.properties.find_one(
        {"id": pid, "agency_id": agency["id"], "status": "active"}, {"_id": 0, "owner": 0},
    )
    if not p:
        raise HTTPException(status_code=404, detail="property_not_found")

    photos = p.get("photos") or []
    canonical = f"/api/p/{slug}/{pid}"
    cover_idx = next((i for i, ph in enumerate(photos) if ph.get("is_cover")), 0 if photos else None)
    og_image = f"/api/public/property/{pid}/photo/{cover_idx}" if cover_idx is not None else None
    title = f"{p.get('title')} — {agency.get('display_name')}"
    price = _eur(p.get('price')) if p.get('price') else (f"{_eur(p.get('rent_monthly'))}/mese" if p.get('rent_monthly') else "—")
    desc = (
        f"{p.get('property_type','')} in {p.get('operation','')} a {p.get('city','')} · "
        f"{p.get('surface_sqm') or '—'} m² · {p.get('rooms') or '—'} locali · {price}"
    ).strip()

    photo_html = "".join(
        f'<img src="/api/public/property/{pid}/photo/{i}" alt="{escape(p.get("title") or "")} foto {i+1}" loading="lazy"/>'
        for i in range(len(photos))
    )
    feats = p.get("features") or {}
    feats_keys = [k for k, v in feats.items() if v] if isinstance(feats, dict) else (feats if isinstance(feats, list) else [])
    feats_html = "".join(f"<span>{escape(k.replace('_', ' '))}</span>" for k in feats_keys)
    en = p.get("energy") or {}

    def cell(label: str, value: Any) -> str:
        if value in (None, ""):
            return ""
        return f'<div><label>{escape(label)}</label><strong>{escape(str(value))}</strong></div>'

    cells = "".join([
        cell("Tipologia", p.get("property_type")),
        cell("Operazione", p.get("operation")),
        cell("Città", p.get("city")),
        cell("Zona", p.get("zone")),
        cell("Superficie", f"{p.get('surface_sqm')} m²" if p.get("surface_sqm") else None),
        cell("Locali", p.get("rooms")),
        cell("Camere", p.get("bedrooms")),
        cell("Bagni", p.get("bathrooms")),
        cell("Piano", p.get("floor")),
        cell("Classe energetica", en.get("energy_class")),
        cell("Anno", p.get("year_built")),
        cell("Riferimento", p.get("reference_code")),
    ])

    description_block = (
        f'<h2>Descrizione</h2><div class="description">{escape(p.get("description") or "")}</div>'
        if p.get("description") else ""
    )
    features_block = (
        f'<h2>Caratteristiche</h2><div class="features">{feats_html}</div>' if feats_html else ""
    )

    body = f"""
    <h1>{escape(p.get('title') or '—')}</h1>
    <p class="meta">{escape(p.get('city') or '')}{(' · ' + escape(p.get('zone'))) if p.get('zone') else ''} · Rif. {escape(p.get('reference_code') or '—')}</p>
    <p class="price">{escape(price)}</p>
    {f'<div class="photos">{photo_html}</div>' if photos else ''}
    <h2>Caratteristiche principali</h2>
    <div class="grid">{cells}</div>
    {description_block}
    {features_block}
    <div class="card">
      <strong>Contatta {escape(agency.get('display_name'))}</strong>
      <p class="meta" style="margin-top:.4rem">Per maggiori informazioni su questo immobile, contatta direttamente l'agenzia.</p>
    </div>
    """

    # schema.org RealEstateListing (JSON-LD)
    import json as _json
    jsonld_obj = {
        "@context": "https://schema.org",
        "@type": "Product",
        "additionalType": "https://schema.org/RealEstateListing",
        "name": p.get("title"),
        "description": p.get("description") or desc,
        "category": p.get("property_type"),
        "image": [og_image] if og_image else [],
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": p.get("price") or p.get("rent_monthly"),
            "availability": "https://schema.org/InStock",
            "seller": {"@type": "RealEstateAgent", "name": agency.get("display_name")},
        },
        "areaServed": p.get("city"),
        "url": canonical,
    }
    jsonld = _json.dumps(jsonld_obj, ensure_ascii=False)

    return Response(
        content=_page_shell(title, desc, canonical, og_image, jsonld, body, agency.get("display_name") or ""),
        media_type="text/html; charset=utf-8",
    )
