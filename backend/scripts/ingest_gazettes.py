#!/usr/bin/env python3
"""
Official Gazette & Legal Metrology Rule Book Ingestion Script.
Reads all PDFs in docs/official_gazettes/, extracts rule sections,
amendments, and schedules, and updates backend/app/rag/lmpc_corpus.py
and frontend/src/data/gazetteRules.ts.
"""

import os
import sys
import glob
import re
import json
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("Error: pypdf not installed. Run 'pip install pypdf'")
    sys.exit(1)

DOCS_DIR = Path(__file__).resolve().parent.parent.parent / "docs" / "official_gazettes"

def extract_text_from_pdf(pdf_path: Path) -> str:
    print(f"--> Parsing: {pdf_path.name}")
    reader = PdfReader(str(pdf_path))
    full_text = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        full_text.append(text)
    print(f"    Extracted {len(reader.pages)} pages, {sum(len(t) for t in full_text)} characters.")
    return "\n".join(full_text)

def list_available_pdfs():
    pdf_files = list(DOCS_DIR.glob("*.pdf"))
    return pdf_files

if __name__ == "__main__":
    pdfs = list_available_pdfs()
    print(f"Found {len(pdfs)} PDF(s) in {DOCS_DIR}:")
    for p in pdfs:
        print(f" - {p.name}")
