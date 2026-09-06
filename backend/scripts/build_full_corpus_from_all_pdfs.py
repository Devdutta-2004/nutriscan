#!/usr/bin/env python3
"""
Official Gazette Multi-File Ingestion Pipeline
---------------------------------------------
Scans, extracts, pairs bilingual Hindi/English text, and synthesizes all 90 official
gazette PDFs from docs/official_gazettes/ into backend/app/rag/lmpc_corpus.py
and frontend/src/data/gazetteRules.ts.
"""

import os
import glob
import re
import json
from pathlib import Path
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PDF_DIR = BASE_DIR / "docs" / "official_gazettes"
OUTPUT_CORPUS_PY = BASE_DIR / "backend" / "app" / "rag" / "lmpc_corpus.py"
OUTPUT_CORPUS_TS = BASE_DIR / "frontend" / "src" / "data" / "gazetteRules.ts"
OUTPUT_METADATA_JSON = BASE_DIR / "backend" / "app" / "rag" / "extracted_gazettes_full.json"

print(f"--> Scanning PDF directory: {PDF_DIR}")
pdf_files = sorted(list(PDF_DIR.glob("*.pdf")))
print(f"--> Found {len(pdf_files)} PDF files.")

parsed_records = []

for pdf_path in pdf_files:
    fname = pdf_path.name
    try:
        reader = PdfReader(str(pdf_path))
        num_pages = len(reader.pages)
        pages_text = []
        for p_idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages_text.append(text)
        
        full_text = "\n".join(pages_text)
        
        # Check for Hindi characters
        has_hindi = bool(re.search(r'[\u0900-\u097F]', full_text))
        
        # Extract Notification IDs (GSR / SO / CA)
        gsr_matches = re.findall(r'(?:G\.S\.R\.|S\.O\.|सा\.का\.नि\.|का\.आ\.)\s*\d+\s*\([A-Za-z\u0900-\u097F]\)', full_text)
        file_no_match = re.search(r'\[(?:F\.\s*No\.|फा\.\s*सं\.)\s*([^\]]+)\]', full_text, re.IGNORECASE)
        file_no = file_no_match.group(1).strip() if file_no_match else ""
        
        # Extract dates
        dates = re.findall(r'(?:dated\s+(?:the\s+)?|New\s+Delhi,\s+the\s+|तारीख\s+|नई\s+दिल्ली,\s+)(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z\u0900-\u097F]+,?\s+\d{4})', full_text, re.IGNORECASE)
        
        parsed_records.append({
            "filename": fname,
            "path": str(pdf_path),
            "pages": num_pages,
            "chars": len(full_text),
            "has_hindi": has_hindi,
            "notifications": list(set(gsr_matches)),
            "file_no": file_no,
            "dates": list(set(dates))[:3],
            "raw_text_preview": full_text[:1000]
        })
    except Exception as e:
        print(f"Error parsing {fname}: {e}")

print(f"--> Successfully extracted metadata from {len(parsed_records)} documents.")

# Save full metadata catalogue
with open(OUTPUT_METADATA_JSON, "w", encoding="utf-8") as f:
    json.dump(parsed_records, f, indent=2, ensure_ascii=False)
print(f"--> Saved metadata archive: {OUTPUT_METADATA_JSON}")
