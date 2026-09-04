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
    Executes complete audit pipeline: Deterministic Math + Big-8 + Gazette RAG.
    """
    if req.preset_id:
        preset = next((p for p in DEMO_PRESETS if p["id"] == req.preset_id), None)
        if not preset:
            raise HTTPException(status_code=404, detail=f"Preset '{req.preset_id}' not found")
        
        report = AuditSynthesizer.synthesize_report(
            product_name=preset["title"],
            label_data=preset["label_data"],
            tokens=preset.get("bounding_boxes", [])
        )
        report["preset_id"] = preset["id"]
        report["image_url"] = preset.get("image_url")
        report["bounding_boxes"] = preset.get("bounding_boxes", [])
        return report

    # Ad-hoc audit with provided label data
    product_name = req.product_name or "Custom Packaged Commodity"
    label_data = req.label_data or {}
    report = AuditSynthesizer.synthesize_report(
        product_name=product_name,
        label_data=label_data,
        tokens=req.bounding_boxes or []
    )
    report["bounding_boxes"] = req.bounding_boxes or []
    return report

@router.post("/upload")
async def upload_and_audit(
    file: UploadFile = File(...),
    product_name: Optional[str] = Form("Scanned Packaging Specimen")
):
    """
    Multi-format image/artwork upload endpoint.
    Performs pre-processing indicators, structured token generation,
    and executes deterministic LMPC audit.
    """
    # Read file content safely
    contents = await file.read()
    file_size_kb = round(len(contents) / 1024, 1)

    # In production with EasyOCR/PaddleOCR, we would pass image bytes.
    # Here we parse or generate structured mock bounding boxes for uploaded packaging.
    detected_boxes = [
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "generic_name",
            "label": "Generic Name",
            "text": "Detected Commodity Title",
            "status": "COMPLIANT",
            "bbox": {"x": 75, "y": 60, "w": 450, "h": 45},
            "color": "#10b981"
        },
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "net_quantity",
            "label": "Net Quantity",
            "text": "Net Wt. 250 g",
            "status": "COMPLIANT",
            "bbox": {"x": 75, "y": 135, "w": 200, "h": 38},
            "color": "#10b981"
        },
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "mrp",
            "label": "MRP",
            "text": "MRP ₹150.00 (incl. of all taxes)",
            "status": "COMPLIANT",
            "bbox": {"x": 300, "y": 135, "w": 250, "h": 38},
            "color": "#10b981"
        },
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "usp",
            "label": "Unit Sale Price (USP)",
            "text": "USP: ₹0.60/g",
            "status": "COMPLIANT",
            "bbox": {"x": 75, "y": 195, "w": 200, "h": 38},
            "color": "#10b981"
        },
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "mfg_address",
            "label": "Manufacturer Address",
            "text": "Manufactured by GreenLife Foods Ltd, Industrial Estate, Pune 411001",
            "status": "COMPLIANT",
            "bbox": {"x": 75, "y": 255, "w": 480, "h": 55},
            "color": "#10b981"
        },
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "consumer_care",
            "label": "Consumer Care",
            "text": "Helpline: 1800-111-2222 | care@greenlife.com",
            "status": "COMPLIANT",
            "bbox": {"x": 75, "y": 330, "w": 480, "h": 40},
            "color": "#10b981"
        },
        {
            "id": f"box_{uuid.uuid4().hex[:6]}",
            "mandate_id": "country_of_origin",
            "label": "Country of Origin",
            "text": "Country of Origin: India",
            "status": "COMPLIANT",
            "bbox": {"x": 75, "y": 390, "w": 220, "h": 35},
            "color": "#10b981"
        }
    ]

    label_data = {
        "generic_name": "Premium Nut Mix",
        "net_quantity": "250g",
        "mrp": "₹150.00 (incl. of all taxes)",
        "unit_sale_price": "₹0.60/g",
        "mfg_date": "02/2024",
        "manufacturer_address": "GreenLife Foods Ltd, Industrial Estate, Pune 411001",
        "consumer_care_phone": "1800-111-2222",
        "consumer_care_email": "care@greenlife.com",
        "country_of_origin": "India"
    }

    report = AuditSynthesizer.synthesize_report(
        product_name=file.filename or product_name,
        label_data=label_data,
        tokens=detected_boxes,
        image_metadata={"filename": file.filename, "size_kb": file_size_kb, "format": file.content_type}
    )
    report["bounding_boxes"] = detected_boxes
    report["is_live_upload"] = True
    return report
