from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from app.rag.gazette_db import lmpc_retrieval_engine
from app.rag.lmpc_corpus import LMPC_CORPUS, CORPUS_VERSION

router = APIRouter(prefix="/gazette", tags=["Gazette RAG"])


@router.get("/search")
async def search_gazette(
    q: str = Query(..., description="Query or violation anomaly description"),
    top_k: int = Query(5, ge=1, le=20),
    category: Optional[str] = Query(None, description="Product category filter (food, cosmetics, electronics, general)")
):
    """
    Hybrid BM25+TF-IDF RAG retrieval: returns top-k statutory clauses
    from the LMPC Rules 2011 corpus with relevance scores.
    """
    results = lmpc_retrieval_engine.search(query=q, top_k=top_k, category=category)
    return {
        "query": q,
        "category_filter": category,
        "count": len(results),
        "corpus_version": CORPUS_VERSION,
        "results": results
    }


@router.get("/rules")
async def list_all_rules(
    category: Optional[str] = Query(None, description="Filter by category"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """
    Returns the full statutory knowledge base corpus with optional filtering and pagination.
    """
    filtered = LMPC_CORPUS
    if category:
        filtered = [c for c in LMPC_CORPUS if c.get("category") == category]

    paginated = filtered[offset:offset + limit]
    return {
        "total_count": len(filtered),
        "offset": offset,
        "limit": limit,
        "corpus_version": CORPUS_VERSION,
        "rules": paginated
    }


@router.get("/rules/{rule_id}")
async def get_rule_by_id(rule_id: str):
    """
    Returns exact statutory chunk by ID (e.g., 'rule_6_1_a', 'rule_32').
    Also returns related rules and applicable penalty information.
    """
    rule = lmpc_retrieval_engine.get_by_id(rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail=f"Rule with id '{rule_id}' not found")

    related = lmpc_retrieval_engine.get_related_rules(rule_id)
    penalty = lmpc_retrieval_engine.get_penalty_for_rule(rule_id)

    return {
        "rule": rule,
        "related_rules": related,
        "applicable_penalty": penalty
    }


@router.get("/categories")
async def list_categories():
    """
    Returns all distinct product categories in the corpus.
    """
    categories = set()
    for chunk in LMPC_CORPUS:
        for cat in chunk.get("applies_to", []):
            categories.add(cat)
    return {
        "categories": sorted(categories)
    }


@router.get("/amendments")
async def list_amendments():
    """
    Returns all amendment-category chunks showing the legislative history
    of LMPC Rules modifications.
    """
    amendments = lmpc_retrieval_engine.get_amendments()
    return {
        "count": len(amendments),
        "corpus_version": CORPUS_VERSION,
        "amendments": amendments
    }


@router.get("/mandates")
async def list_mandates(
    product_category: str = Query("general", description="Product category")
):
    """
    Returns all mandatory declaration rules applicable to a given product category.
    """
    mandates = lmpc_retrieval_engine.get_all_mandates(product_category)
    return {
        "product_category": product_category,
        "count": len(mandates),
        "mandates": mandates
    }
