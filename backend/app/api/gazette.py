from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from app.rag.gazette_db import gazette_rag_engine
from app.rag.seed_data import STATUTORY_CHUNKS

router = APIRouter(prefix="/gazette", tags=["Gazette RAG"])

@router.get("/search")
async def search_gazette(
    q: str = Query(..., description="Query or violation anomaly description"),
    top_k: int = Query(3, ge=1, le=10)
):
    """
    Document-Grounded RAG retrieval: returns top-k exact gazette clauses.
    """
    results = gazette_rag_engine.search(query=q, top_k=top_k)
    return {
        "query": q,
        "count": len(results),
        "results": results
    }

@router.get("/rules")
async def list_all_rules():
    """
    Returns full statutory knowledge base corpus.
    """
    return {
        "count": len(STATUTORY_CHUNKS),
        "rules": STATUTORY_CHUNKS
    }

@router.get("/rules/{rule_id}")
async def get_rule_by_id(rule_id: str):
    rule = gazette_rag_engine.get_by_id(rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail=f"Rule with id '{rule_id}' not found")
    return rule
