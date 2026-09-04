from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.compliance.math_engine import DeterministicMathEngine
from app.compliance.big8_checker import Big8Checker

router = APIRouter(prefix="/compliance", tags=["Compliance"])

class USPVerifyRequest(BaseModel):
    mrp: str
    net_quantity: str
    printed_usp: Optional[str] = None

class MandateEvaluateRequest(BaseModel):
    label_data: Dict[str, Any]

@router.post("/verify-usp")
async def verify_usp_endpoint(req: USPVerifyRequest):
    """
    Pure deterministic calculation endpoint for Unit Sale Price.
    Zero LLM reliance.
    """
    result = DeterministicMathEngine.verify_usp(
        mrp_str=req.mrp,
        qty_str=req.net_quantity,
        printed_usp_str=req.printed_usp
    )
    return result

@router.post("/evaluate-mandates")
async def evaluate_mandates_endpoint(req: MandateEvaluateRequest):
    """
    Evaluates the Big-8 mandatory LMPC declarations.
    """
    result = Big8Checker.evaluate(req.label_data)
    return result
