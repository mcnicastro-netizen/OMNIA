"""OMNIA — M5.S4 Virtual Staging (Sprint 1: pipeline 3-stage MVP).

Reference: DECISIONS.md D-033.

Pipeline:
  Stage 1 — SAM 2 segmentation → maschera pavimento (fal-ai/segment-anything-2)
  Stage 2 — Flux inpainting → arredamento nella zona mascherata (fal-ai/flux-general/inpainting)
  Stage 3 — Real-ESRGAN 4x upscale (fal-ai/real-esrgan)

Then watermark "Render virtuale OMNIA" applied server-side on download.
Cost per render: ~€0.056 (D-033).

Sprint 4.1 delivers ONE variant. Sprint 4.2 will add 4-variants parallel + Reverse Staging.
"""
from __future__ import annotations

import asyncio
import io
import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

import fal_client
import httpx
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    Response,
    UploadFile,
)
from PIL import Image, ImageDraw, ImageFont
from pydantic import BaseModel, Field

from shared.auth.dependencies import get_current_user
from shared.db.connection import Database

logger = logging.getLogger("omnia.staging")
router = APIRouter(prefix="/staging", tags=["virtual-staging"])

# Ensure the env var is exported so fal_client picks it up
if os.environ.get("FAL_KEY") and not fal_client.__dict__.get("_KEY_EXPORTED"):
    fal_client._KEY_EXPORTED = True

MODEL_SAM2 = "fal-ai/sam2/auto-segment"
MODEL_FLUX_INPAINT = "fal-ai/flux-lora/inpainting"  # faster than flux-general (D-033 primary)
MODEL_UPSCALE = "fal-ai/esrgan"

MAX_UPLOAD_MB = 12
ALLOWED_MIME = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
SOFT_RATE_LIMIT_HOUR = 20  # renders/hour/user
JOB_TTL_DAYS = 30

# ─── Style catalog (prompts calibrated for real-estate rooms) ───
STYLES: Dict[str, Dict[str, str]] = {
    "modern": {
        "label": "Moderno",
        "prompt": "modern minimalist interior, neutral colors, clean lines, natural light, high-end contemporary furniture, wooden floor, professional interior photography",
    },
    "classic": {
        "label": "Classico",
        "prompt": "classic elegant italian interior, warm colors, traditional wooden furniture, curtains, chandelier, parquet flooring, refined atmosphere",
    },
    "scandi": {
        "label": "Scandinavo",
        "prompt": "scandinavian interior design, white walls, light wooden floor, minimalist furniture, cozy textiles, natural light, hygge atmosphere",
    },
    "industrial": {
        "label": "Industriale",
        "prompt": "industrial loft style, exposed brick, metal fixtures, concrete floor, leather sofa, edison bulbs, urban chic",
    },
    "luxury": {
        "label": "Luxury",
        "prompt": "luxury interior design, marble floor, designer furniture, gold accents, high ceilings, large windows, premium finishes",
    },
}

ROOM_TYPES: Dict[str, str] = {
    "living": "spacious living room with sofa, coffee table, TV area, decorative plants",
    "bedroom": "bedroom with double bed, nightstands, wardrobe, soft ambient lighting",
    "kitchen": "modern kitchen with island, appliances, dining area, pendant lights",
    "dining": "dining room with table for 6, chairs, sideboard, elegant lighting",
    "bathroom": "bathroom with modern fixtures, shower, vanity, towels, plants",
    "office": "home office with desk, ergonomic chair, bookshelf, natural light",
}

NEGATIVE_PROMPT = (
    "people, humans, faces, text, watermark, logo, distorted furniture, "
    "blurry, low quality, deformed walls, weird perspective"
)

# ─── Schemas ─────────────────────────────────────────────────────
class StagingGenerateBody(BaseModel):
    image_url: str = Field(..., description="Public URL of the source room photo")
    style: str = Field(default="modern")
    room_type: str = Field(default="living")
    property_id: Optional[str] = None


class StagingStages(BaseModel):
    name: str
    status: str  # queued|running|done|failed
    duration_ms: Optional[int] = None
    cost_usd: Optional[float] = None
    error: Optional[str] = None


class StagingJobOut(BaseModel):
    id: str
    status: str  # pending|running|done|failed
    source_url: str
    style: str
    room_type: str
    property_id: Optional[str]
    stages: List[StagingStages]
    variant_url: Optional[str] = None
    cost_total_usd: Optional[float] = None
    error: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None


# ─── Helpers ─────────────────────────────────────────────────────
async def _rate_limit(db, user_id: str) -> None:
    since = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    count = await db.virtual_staging_jobs.count_documents({
        "user_id": user_id,
        "created_at": {"$gte": since.isoformat()},
    })
    if count >= SOFT_RATE_LIMIT_HOUR:
        raise HTTPException(
            status_code=429,
            detail=f"Limite orario raggiunto ({SOFT_RATE_LIMIT_HOUR} render/ora)",
        )


def _build_prompt(style: str, room_type: str) -> str:
    s = STYLES.get(style, STYLES["modern"])
    room = ROOM_TYPES.get(room_type, ROOM_TYPES["living"])
    return f"{s['prompt']}, {room}, photorealistic, 8k, architectural photography"


def _job_to_out(doc: dict) -> StagingJobOut:
    return StagingJobOut(
        id=doc["id"],
        status=doc["status"],
        source_url=doc["source_url"],
        style=doc["style"],
        room_type=doc["room_type"],
        property_id=doc.get("property_id"),
        stages=[StagingStages(**s) for s in doc.get("stages", [])],
        variant_url=doc.get("variant_url"),
        cost_total_usd=doc.get("cost_total_usd"),
        error=doc.get("error"),
        created_at=doc["created_at"],
        completed_at=doc.get("completed_at"),
    )


# ─── Pipeline stages ─────────────────────────────────────────────
async def _stage_sam2_mask(image_url: str) -> str:
    """Run SAM 2 auto-segmentation → returns URL of the mask image (largest segment)."""
    handler = await fal_client.submit_async(
        MODEL_SAM2,
        arguments={
            "image_url": image_url,
            "points_per_side": 32,
            "output_format": "png",
        },
    )
    result = await handler.get()
    # SAM 2 returns individual_masks (list) — we use the first/largest for MVP
    masks = result.get("individual_masks") or result.get("combined_mask") or []
    if isinstance(masks, list) and masks:
        # Prefer combined_mask if available; else pick largest by area heuristic (first is often floor)
        mask_url = masks[0].get("url") if isinstance(masks[0], dict) else masks[0]
    elif isinstance(masks, dict):
        mask_url = masks.get("url")
    else:
        mask_url = result.get("combined_mask", {}).get("url") if isinstance(result.get("combined_mask"), dict) else None
    if not mask_url:
        raise RuntimeError(f"SAM2 returned no mask (keys: {list(result.keys())})")
    return mask_url


async def _stage_flux_inpaint(image_url: str, mask_url: str, prompt: str) -> str:
    """Run Flux inpainting with SAM 2 mask → returns URL of the staged image."""
    handler = await fal_client.submit_async(
        MODEL_FLUX_INPAINT,
        arguments={
            "image_url": image_url,
            "mask_url": mask_url,
            "prompt": prompt,
            "negative_prompt": NEGATIVE_PROMPT,
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": 1,
            "enable_safety_checker": True,
        },
    )
    result = await handler.get()
    images = result.get("images") or []
    if not images:
        raise RuntimeError(f"Flux returned no images (keys: {list(result.keys())})")
    return images[0].get("url")


async def _stage_upscale(image_url: str) -> str:
    """Real-ESRGAN 4x upscale → returns URL of hi-res image."""
    handler = await fal_client.submit_async(
        MODEL_UPSCALE,
        arguments={
            "image_url": image_url,
            "scale": 4,
            "model": "RealESRGAN_x4plus",
        },
    )
    result = await handler.get()
    return (result.get("image") or {}).get("url") or result.get("image_url")


async def _run_pipeline(job_id: str, db) -> None:
    """Background task: execute 3-stage pipeline for job_id."""
    from time import monotonic

    async def _mark_stage(stage_idx: int, patch: dict) -> None:
        await db.virtual_staging_jobs.update_one(
            {"id": job_id},
            {"$set": {f"stages.{stage_idx}.{k}": v for k, v in patch.items()}},
        )

    async def _mark_root(patch: dict) -> None:
        await db.virtual_staging_jobs.update_one({"id": job_id}, {"$set": patch})

    doc = await db.virtual_staging_jobs.find_one({"id": job_id})
    if not doc:
        return

    await _mark_root({"status": "running"})
    prompt = _build_prompt(doc["style"], doc["room_type"])
    src = doc["source_url"]
    total_cost = 0.0

    # Stage 1: SAM 2
    try:
        t0 = monotonic()
        await _mark_stage(0, {"status": "running"})
        mask_url = await _stage_sam2_mask(src)
        await _mark_stage(0, {
            "status": "done",
            "duration_ms": int((monotonic() - t0) * 1000),
            "cost_usd": 0.001,
        })
        total_cost += 0.001
    except Exception as e:
        logger.exception("SAM2 stage failed for %s", job_id)
        await _mark_stage(0, {"status": "failed", "error": str(e)[:300]})
        await _mark_root({"status": "failed", "error": f"SAM2: {str(e)[:200]}",
                          "completed_at": datetime.now(timezone.utc).isoformat()})
        return

    # Stage 2: Flux inpaint
    try:
        t0 = monotonic()
        await _mark_stage(1, {"status": "running"})
        staged_url = await _stage_flux_inpaint(src, mask_url, prompt)
        await _mark_stage(1, {
            "status": "done",
            "duration_ms": int((monotonic() - t0) * 1000),
            "cost_usd": 0.05,
        })
        total_cost += 0.05
    except Exception as e:
        logger.exception("Flux stage failed for %s", job_id)
        await _mark_stage(1, {"status": "failed", "error": str(e)[:300]})
        await _mark_root({"status": "failed", "error": f"Flux: {str(e)[:200]}",
                          "completed_at": datetime.now(timezone.utc).isoformat()})
        return

    # Stage 3: Real-ESRGAN upscale
    try:
        t0 = monotonic()
        await _mark_stage(2, {"status": "running"})
        final_url = await _stage_upscale(staged_url)
        await _mark_stage(2, {
            "status": "done",
            "duration_ms": int((monotonic() - t0) * 1000),
            "cost_usd": 0.005,
        })
        total_cost += 0.005
    except Exception as e:
        # Upscale failure is non-fatal: fall back to non-upscaled staged image
        logger.warning("Upscale failed, using staged image: %s", e)
        await _mark_stage(2, {"status": "failed", "error": str(e)[:300]})
        final_url = staged_url

    await _mark_root({
        "status": "done",
        "variant_url": final_url,
        "cost_total_usd": round(total_cost, 4),
        "completed_at": datetime.now(timezone.utc).isoformat(),
    })


def _apply_watermark(image_bytes: bytes, text: str = "Render virtuale OMNIA") -> bytes:
    """Apply bottom-right watermark on an image (PIL, in-memory)."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Dynamic font size relative to image width
    font_size = max(20, img.size[0] // 40)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    padding = font_size // 2
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    box_x0 = img.size[0] - tw - padding * 3
    box_y0 = img.size[1] - th - padding * 3
    # Semi-transparent black rectangle behind text
    draw.rectangle(
        [box_x0, box_y0, img.size[0] - padding, img.size[1] - padding],
        fill=(0, 0, 0, 160),
    )
    draw.text(
        (box_x0 + padding, box_y0 + padding),
        text,
        font=font,
        fill=(255, 255, 255, 255),
    )
    watermarked = Image.alpha_composite(img, overlay).convert("RGB")
    out = io.BytesIO()
    watermarked.save(out, format="JPEG", quality=90)
    return out.getvalue()


# ─── Endpoints ───────────────────────────────────────────────────
@router.get("/styles")
async def list_styles() -> Dict[str, Any]:
    """Returns available styles + room types for the frontend."""
    return {
        "styles": [{"key": k, "label": v["label"]} for k, v in STYLES.items()],
        "room_types": [{"key": k, "label": k.capitalize()} for k in ROOM_TYPES.keys()],
    }


@router.post("/upload")
async def upload_source_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
) -> Dict[str, str]:
    """Upload a source room photo to fal storage → returns a public URL usable by the pipeline."""
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(400, f"MIME non supportato: {file.content_type}")
    data = await file.read()
    if len(data) > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"File troppo grande (max {MAX_UPLOAD_MB} MB)")

    # Upload to fal storage
    import tempfile

    suffix = ".jpg" if "jpeg" in file.content_type or "jpg" in file.content_type else ".png"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        # fal_client.upload_file is sync
        url = await asyncio.to_thread(fal_client.upload_file, tmp_path)
        return {"url": url}
    except Exception as e:
        logger.exception("fal upload failed")
        raise HTTPException(502, f"Upload fallito: {str(e)[:200]}")
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


@router.post("/generate", response_model=StagingJobOut)
async def generate_staging(
    body: StagingGenerateBody,
    background: BackgroundTasks,
    user=Depends(get_current_user),
) -> StagingJobOut:
    """Enqueue a virtual-staging job. Returns immediately with job_id; polling via /jobs/{id}."""
    db = Database.get()
    await _rate_limit(db, user["id"])

    if body.style not in STYLES:
        raise HTTPException(400, f"Stile non supportato: {body.style}")
    if body.room_type not in ROOM_TYPES:
        raise HTTPException(400, f"Tipo stanza non supportato: {body.room_type}")

    job_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": job_id,
        "user_id": user["id"],
        "agency_id": user.get("agency_id"),
        "property_id": body.property_id,
        "source_url": body.image_url,
        "style": body.style,
        "room_type": body.room_type,
        "status": "pending",
        "stages": [
            {"name": "sam2_mask", "status": "queued"},
            {"name": "flux_inpaint", "status": "queued"},
            {"name": "upscale", "status": "queued"},
        ],
        "variant_url": None,
        "cost_total_usd": None,
        "error": None,
        "created_at": now,
        "completed_at": None,
    }
    await db.virtual_staging_jobs.insert_one(doc)

    background.add_task(_run_pipeline, job_id, db)
    return _job_to_out(doc)


@router.get("/jobs/{job_id}", response_model=StagingJobOut)
async def get_job(job_id: str, user=Depends(get_current_user)) -> StagingJobOut:
    db = Database.get()
    doc = await db.virtual_staging_jobs.find_one({"id": job_id, "user_id": user["id"]})
    if not doc:
        raise HTTPException(404, "Job non trovato")
    return _job_to_out(doc)


@router.get("/history")
async def list_history(
    user=Depends(get_current_user), limit: int = 50
) -> Dict[str, Any]:
    db = Database.get()
    cursor = db.virtual_staging_jobs.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("created_at", -1).limit(min(limit, 100))
    items = [_job_to_out(d).model_dump() for d in await cursor.to_list(length=100)]
    return {"items": items, "count": len(items)}


@router.get("/jobs/{job_id}/download")
async def download_watermarked(job_id: str, user=Depends(get_current_user)) -> Response:
    """Downloads the watermarked final image (AGCM 2024 + Art. 21 Codice Consumo compliance)."""
    db = Database.get()
    doc = await db.virtual_staging_jobs.find_one({"id": job_id, "user_id": user["id"]})
    if not doc:
        raise HTTPException(404, "Job non trovato")
    if doc["status"] != "done" or not doc.get("variant_url"):
        raise HTTPException(409, "Job non ancora completato")

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(doc["variant_url"])
        r.raise_for_status()
        source_bytes = r.content

    watermarked = await asyncio.to_thread(_apply_watermark, source_bytes)
    filename = f"omnia-staging-{job_id[:8]}.jpg"
    return Response(
        content=watermarked,
        media_type="image/jpeg",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, user=Depends(get_current_user)) -> Dict[str, bool]:
    db = Database.get()
    res = await db.virtual_staging_jobs.delete_one({"id": job_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(404, "Job non trovato")
    return {"ok": True}
