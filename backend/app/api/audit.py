from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import uuid
from app.data.presets import DEMO_PRESETS
from app.compliance.synthesizer import AuditSynthesizer

router = APIRouter(prefix="/audit", tags=["Audit"])


class AuditRequest(BaseModel):
    preset_id: Optional[str] = None
    product_name: Optional[str] = None
    label_data: Optional[Dict[str, Any]] = None
    bounding_boxes: Optional[List[Dict[str, Any]]] = None
    product_category: Optional[str] = "general"


@router.get("/presets")
async def get_presets():
    """
    Returns pre-loaded showcase presets with OCR bounding boxes and expected compliance stats.
    """
    return {
        "count": len(DEMO_PRESETS),
        "presets": DEMO_PRESETS
    }


@router.post("/run")
async def run_audit(req: AuditRequest):
    """
    Executes complete audit pipeline: Deterministic Math + Big-8+ + Hybrid RAG + Optional Gemini LLM.
    """
    if req.preset_id:
        preset = next((p for p in DEMO_PRESETS if p["id"] == req.preset_id), None)
        if not preset:
            raise HTTPException(status_code=404, detail=f"Preset '{req.preset_id}' not found")

        # Use async LLM-enhanced synthesis
        report = await AuditSynthesizer.synthesize_report_with_llm(
            product_name=preset["title"],
            label_data=preset["label_data"],
            tokens=preset.get("bounding_boxes", []),
            product_category=req.product_category or "general"
        )
        report["preset_id"] = preset["id"]
        report["image_url"] = preset.get("image_url")
        report["bounding_boxes"] = preset.get("bounding_boxes", [])
        return report

    # Ad-hoc audit with provided label data
    product_name = req.product_name or "Custom Packaged Commodity"
    label_data = req.label_data or {}

    # Use async LLM-enhanced synthesis
    report = await AuditSynthesizer.synthesize_report_with_llm(
        product_name=product_name,
        label_data=label_data,
        tokens=req.bounding_boxes or [],
        product_category=req.product_category or "general"
    )
    report["bounding_boxes"] = req.bounding_boxes or []
    return report


from app.rag.gemini_engine import gemini_engine


@router.post("/upload")
async def upload_and_audit(
    files: Optional[List[UploadFile]] = File(None),
    file: Optional[UploadFile] = File(None),
    product_name: Optional[str] = Form("Scanned Packaging Specimen"),
    product_category: Optional[str] = Form("food"),
    label_data_json: Optional[str] = Form(None)
):
    """
    Multi-Image & Single-Image upload endpoint for label compliance audit.
    Accepts 1 to 5 images representing different panels of the same physical product
    (e.g., Front Display Panel, Back Information Panel, MRP top/bottom flap, Side Nutritional Box).
    
    1. Multi-Image Multimodal Vision: Reads declarations across all panels simultaneously.
    2. Deterministic Legal Engine: Synthesizes statutory compliance, checks Rule 6(11) USP paise math, PIN code, and Rule 32 penalties.
    """
    # Collect all uploaded files
    uploaded_files: List[UploadFile] = []
    if files:
        uploaded_files.extend(files)
    if file and file not in uploaded_files:
        uploaded_files.append(file)

    if not uploaded_files:
        raise HTTPException(status_code=400, detail="No image file provided for audit")

    images_payload: List[tuple[bytes, str]] = []
    total_size_kb = 0.0
    primary_filename = uploaded_files[0].filename or "Specimen"

    for f in uploaded_files:
        contents = await f.read()
        size_kb = round(len(contents) / 1024, 1)
        total_size_kb += size_kb
        images_payload.append((contents, f.content_type or "image/jpeg"))

    label_data = {}
    if label_data_json:
        try:
            label_data = json.loads(label_data_json)
        except json.JSONDecodeError:
            label_data = {}

    # If Gemini Vision is available, run multimodal extraction on ALL photos together
    if gemini_engine.is_available and len(images_payload) > 0:
        vision_fields = await gemini_engine.extract_label_from_images(images_payload)
        if vision_fields:
            # Merge vision fields: populate any empty/null fields
            for k, v in vision_fields.items():
                if v and (not label_data.get(k) or str(label_data.get(k)).strip().lower() in ["", "none", "missing", "n/a", "[not found]"]):
                    label_data[k] = v

    # Fallback to product_name or filename if generic name still missing
    if not label_data.get("generic_name"):
        clean_name = primary_filename.replace(".jpg", "").replace(".png", "").replace(".jpeg", "")
        if not clean_name.startswith("IMG") and not clean_name.startswith("upload") and not clean_name.startswith("Camera"):
            label_data["generic_name"] = clean_name

    bounding_boxes = label_data.pop("bounding_boxes", [])

    report = await AuditSynthesizer.synthesize_report_with_llm(
        product_name=label_data.get("generic_name") or primary_filename or product_name,
        label_data=label_data,
        tokens=bounding_boxes,
        image_metadata={
            "filename": primary_filename,
            "panel_count": len(uploaded_files),
            "size_kb": round(total_size_kb, 1),
            "format": uploaded_files[0].content_type
        },
        product_category=product_category or "food"
    )
    report["bounding_boxes"] = bounding_boxes
    report["is_live_upload"] = True
    report["panel_count"] = len(uploaded_files)
    return report
