"""
FairPack: LMPC Packaging Compliance & Regulatory RAG Platform.
FastAPI Backend Application Entry Point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.audit import router as audit_router
from app.api.compliance import router as compliance_router
from app.api.gazette import router as gazette_router

app = FastAPI(
    title="FairPack API",
    description="Deterministic LMPC Compliance & Gazette RAG Engine",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(audit_router, prefix="/api")
app.include_router(compliance_router, prefix="/api")
app.include_router(gazette_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "FairPack Compliance & RAG Engine",
        "version": "1.0.0",
        "rules_indexed": 9
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
