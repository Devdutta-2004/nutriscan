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
    file: UploadFile = File(...),
    product_name: Optional[str] = Form("Scanned Packaging Specimen"),
    product_category: Optional[str] = Form("food"),
    label_data_json: Optional[str] = Form(None)
):
    """
    Image upload endpoint for label compliance audit.
    1. Multimodal Vision: Reads packaging text using Gemini 3.6 Flash Vision (handles curved, glossy, folded labels).
    2. Deterministic Legal Engine: Synthesizes statutory compliance, checks Rule 6(11) USP paise math, PIN code, and Rule 32 penalties.
    """
    # Read file content safely
    contents = await file.read()
    file_size_kb = round(len(contents) / 1024, 1)

    label_data = {}
    if label_data_json:
        try:
            label_data = json.loads(label_data_json)
        except json.JSONDecodeError:
            label_data = {}

    # If Gemini Vision is available, run multimodal extraction on the raw photo bytes
    if gemini_engine.is_available and len(contents) > 0:
        mime_type = file.content_type or "image/jpeg"
        vision_fields = await gemini_engine.extract_label_from_image(contents, mime_type=mime_type)
        if vision_fields:
            # Merge vision fields: vision data populates any missing/null fields
            for k, v in vision_fields.items():
                if v and (not label_data.get(k) or str(label_data.get(k)).strip().lower() in ["", "none", "missing", "n/a", "[not found]"]):
                    label_data[k] = v

    # Fallback to product_name or filename if generic name still missing
    if not label_data.get("generic_name"):
        clean_name = (file.filename or product_name or "Custom Specimen").replace(".jpg", "").replace(".png", "").replace(".jpeg", "")
        if not clean_name.startswith("IMG") and not clean_name.startswith("upload"):
            label_data["generic_name"] = clean_name

    bounding_boxes = label_data.pop("bounding_boxes", [])

    report = await AuditSynthesizer.synthesize_report_with_llm(
        product_name=label_data.get("generic_name") or file.filename or product_name,
        label_data=label_data,
        tokens=bounding_boxes,
        image_metadata={"filename": file.filename, "size_kb": file_size_kb, "format": file.content_type},
        product_category=product_category or "food"
    )
    report["bounding_boxes"] = bounding_boxes
    report["is_live_upload"] = True
    return report
