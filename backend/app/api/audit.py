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


@router.post("/upload")
async def upload_and_audit(
    file: UploadFile = File(...),
    product_name: Optional[str] = Form("Scanned Packaging Specimen"),
    product_category: Optional[str] = Form("general"),
    label_data_json: Optional[str] = Form(None)
):
    """
    Image upload endpoint for label compliance audit.
    
    Accepts uploaded image and optional pre-extracted label_data from
    frontend OCR. If label_data_json is provided, uses that instead of
    generating mock data.
    """
    # Read file content safely
    contents = await file.read()
    file_size_kb = round(len(contents) / 1024, 1)

    # Use frontend-extracted label data if provided
    if label_data_json:
        try:
            label_data = json.loads(label_data_json)
        except json.JSONDecodeError:
            label_data = {}
    else:
        # Fallback: minimal label data from filename
        label_data = {
            "generic_name": product_name or file.filename,
        }

    # Get bounding boxes from label data if present
    bounding_boxes = label_data.pop("bounding_boxes", [])

    report = await AuditSynthesizer.synthesize_report_with_llm(
        product_name=file.filename or product_name,
        label_data=label_data,
        tokens=bounding_boxes,
        image_metadata={"filename": file.filename, "size_kb": file_size_kb, "format": file.content_type},
        product_category=product_category or "general"
    )
    report["bounding_boxes"] = bounding_boxes
    report["is_live_upload"] = True
    return report
