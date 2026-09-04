"""
Consumer Affairs Gazette & Legal Metrology PDF Ingestion Pipeline
------------------------------------------------------------------
Automated ingestion tool to fetch, parse, and synchronize multi-page Hindi and English
official rulebooks and amendments from the Department of Consumer Affairs
(https://consumeraffairs.gov.in/pages/legal-metrology-act).

Features:
1. Catalogs official Legal Metrology Packaged Commodities (LMPC) PDFs (2011-2026).
2. Uses Gemini Multimodal Vision API to parse multi-page Hindi Devanagari Gazette PDFs.
3. Extracts structured bilingual statutory clauses, amendments, schedules, and penalties.
4. Synchronizes verified statutory rules with the application knowledge base.
"""

import os
import sys
import json
import base64
import argparse
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("gazette_sync")

def load_env():
    env_file = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    val = val.strip().strip("'").strip('"')
                    os.environ.setdefault(key.strip(), val)

load_env()

OFFICIAL_CONSUMER_AFFAIRS_CATALOG = [
    {
        "id": "lmpc_rules_2011_base",
        "year": 2011,
        "title": "The Legal Metrology (Packaged Commodities) Rules, 2011 (Base GSR 202(E))",
        "title_hindi": "विधिक माप विज्ञान (पैकेज में रखी वस्तुएं) नियम, 2011",
        "url": "http://consumeraffairs.gov.in/public/upload/files/8_1732871406.pdf",
        "category": "Foundational Rules",
        "significance": "Foundational 34 rules establishing Big-8 mandatory declarations, font tables, and penalties."
    },
    {
        "id": "act_2009_base",
        "year": 2009,
        "title": "The Legal Metrology Act, 2009 (Act No. 1 of 2010)",
        "title_hindi": "विधिक माप विज्ञान अधिनियम, 2009 (2010 का 1)",
        "url": "https://consumeraffairs.gov.in/pages/legal-metrology-act",
        "category": "Parent Act",
        "significance": "Primary Parliamentary Act giving search, seizure, and inspection powers under Section 15 & 36."
    },
    {
        "id": "jan_vishwas_act_2023",
        "year": 2023,
        "title": "Jan Vishwas (Amendment of Provisions) Act, 2023 (18 of 2023)",
        "title_hindi": "जन विश्वास (उपबंधों का संशोधन) अधिनियम, 2023",
        "url": "http://consumeraffairs.gov.in/public/upload/files/Jan%20Vishwas%20(Amendment%20of%20Provisions)%20Act,%202023%20(18%20of%202023)_1732708241.pdf",
        "category": "Penalty Reform Act",
        "significance": "Decriminalizes first offenses and replaces imprisonment with structured fiscal compounding."
    },
    {
        "id": "pcr_amendment_2017_dual_mrp",
        "year": 2017,
        "title": "Packaged Commodities Amendment Rules, 2017 (G.S.R. 629(E))",
        "title_hindi": "पैकेज में रखी वस्तुएं (संशोधन) नियम, 2017 (दोहरी एमआरपी प्रतिबंध)",
        "url": "http://consumeraffairs.gov.in/public/upload/files/8(xii)_0_1732871346.pdf",
        "category": "Landmark Amendment",
        "significance": "Strictly bans dual MRP (Rule 18(2A)), revises Table-I font sizes, and introduces Rule 6(10) for e-commerce."
    },
    {
        "id": "pcr_amendment_2021_usp",
        "year": 2021,
        "title": "Packaged Commodities Amendment Rules, 2021 (G.S.R. 779(E) - Unit Sale Price)",
        "title_hindi": "पैकेज में रखी वस्तुएं (संशोधन) नियम, 2021 (इकाई विक्रय मूल्य - यूएसपी)",
        "url": "https://consumeraffairs.gov.in/public/upload/files/230946_1732871433.pdf",
        "category": "Landmark Amendment",
        "significance": "Mandates Unit Sale Price (USP) per g/kg/ml/L under Rule 6(1)(s) & Rule 6(11) to prevent shrinkflation."
    },
    {
        "id": "pcr_amendment_2022_qr_code",
        "year": 2022,
        "title": "Packaged Commodities Second Amendment Rules, 2022 (QR Code Declarations)",
        "title_hindi": "पैकेज में रखी वस्तुएं (द्वितीय संशोधन) नियम, 2022 (क्यूआर कोड)",
        "url": "http://consumeraffairs.gov.in/public/upload/files/Notification%20-%20%20Legal%20Metrology%20(QR%20Code)_1732871487.pdf",
        "category": "Technology Regulation",
        "significance": "Permits electronic commodities to display detailed declarations via QR codes."
    },
    {
        "id": "pcr_amendment_2022_garments",
        "year": 2022,
        "title": "Packaged Commodities Third Amendment Rules, 2022 (Readymade Garments)",
        "title_hindi": "पैकेज में रखी वस्तुएं (तृतीय संशोधन) नियम, 2022 (वस्त्र एवं होजरी)",
        "url": "http://consumeraffairs.gov.in/public/upload/files/2022%203rd%20amendment%20in%20PCR%20Garments_1733228786.pdf",
        "category": "Category Specific",
        "significance": "Clarifies exemptions and specific declaration rules for textile, open garment, and hosiery packages."
    },
    {
        "id": "pcr_sop_edible_oils_2023",
        "year": 2023,
        "title": "Standard Operating Procedure (SOP) for Edible Oils & Fats Net Quantity (29.12.2023)",
        "title_hindi": "खाद्य तेलों और वसा की शुद्ध मात्रा निर्धारण हेतु मानक संचालन प्रक्रिया (एसओपी)",
        "url": "http://consumeraffairs.gov.in/public/upload/files/2023.12.29%20Standard%20Operating%20Procedure%20for%20Edible%20oil%20&%20Fats%20Net%20Quantity%20Measurement%20signed%20copy_1732872010.pdf",
        "category": "Testing SOP",
        "significance": "Standardizes density temperature correction when verifying net volume vs. mass."
    },
    {
        "id": "pcr_amendment_2025_pan_masala",
        "year": 2025,
        "title": "Packaged Commodities Second Amendment Rules, 2025 (Pan Masala Compliance)",
        "title_hindi": "पैकेज में रखी वस्तुएं (द्वितीय संशोधन) नियम, 2025 (पान मसाला)",
        "url": "https://consumeraffairs.gov.in/public/upload/files/2nd%20PCR%20Pan%20Masala_1764736734.pdf",
        "category": "Category Specific",
        "significance": "Strict mandatory declaration and non-exemption enforcement for pan masala."
    },
    {
        "id": "pcr_amendment_2026_coo_ecommerce",
        "year": 2026,
        "title": "Packaged Commodities Amendment Rules, 2026 (Country of Origin Filter on E-Commerce)",
        "title_hindi": "पैकेज में रखी वस्तुएं (संशोधन) नियम, 2026 (ई-कॉमर्स पर मूल देश फिल्टर)",
        "url": "https://consumeraffairs.gov.in/public/upload/files/2026.02.13%20PCR%201st%20COO%20Filter%20on%20e-commerce%20websites_1771231030.pdf",
        "category": "E-Commerce Reform",
        "significance": "Requires all online marketplace platforms to display clear Country of Origin filter and tags."
    }
]

def download_pdf(url: str, dest_path: str) -> bool:
    """Download official government PDF with proper browser headers."""
    logger.info(f"Downloading from {url} to {dest_path}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/pdf,*/*"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            with open(dest_path, "wb") as f:
                f.write(content)
        logger.info(f"Successfully downloaded ({len(content) / 1024:.1f} KB)")
        return True
    except Exception as e:
        logger.error(f"Failed to download {url}: {e}")
        return False

def analyze_pdf_with_gemini(pdf_path: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Send multi-page PDF (English or Hindi Devanagari) to Gemini 2.0 Flash
    for bilingual rule extraction and statutory structured compilation.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is not set in environment or .env file.")

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    logger.info(f"Reading PDF for Gemini multimodal analysis: {pdf_path}")
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    b64_pdf = base64.b64encode(pdf_bytes).decode("utf-8")

    prompt = """You are a Principal Legal Metrology Officer and bilingual Hindi-English legal expert for the Government of India.
Analyze this official Ministry of Consumer Affairs Gazette / Rulebook document (which may be in Hindi Devanagari or English).

Extract ALL statutory provisions, amendments, and rules into this structured JSON format:
{
  "document_title": "Official Title of Notification/Act",
  "document_title_hindi": "आधिकारिक हिंदी शीर्षक (जैसे: विधिक माप विज्ञान (पैकेज में रखी वस्तुएं) नियम, 2011)",
  "gazette_notification_no": "e.g. G.S.R. 202(E) / सा.का.नि. 202(अ)",
  "date_of_notification": "YYYY-MM-DD",
  "effective_date": "YYYY-MM-DD",
  "authority": "e.g. Ministry of Consumer Affairs, Food and Public Distribution",
  "extracted_rules": [
    {
      "rule_id": "rule_6_1_a",
      "rule_no": "Rule 6(1)(a) / नियम 6(1)(क)",
      "title_en": "Manufacturer / Packer / Importer Details",
      "title_hi": "विनिर्माता / पैककर्ता / आयातक का विवरण",
      "verbatim_text_en": "Exact English rule text from document",
      "verbatim_text_hi": "राजपत्र में दिया गया मूल हिंदी पाठ",
      "officer_enforcement_directive": "Plain English directive for inspectors verifying product labels",
      "applicable_penalty": "e.g. Rule 32 / Section 36(1) - ₹25,000 fine",
      "is_mandatory_declaration": true,
      "mathematical_formula": "Optional math formula (e.g. USP = MRP / NetQty)",
      "category": "declaration | typography | units | pricing | penalty | schedule"
    }
  ]
}

Return ONLY pure valid JSON. Do not include markdown code blocks (```json)."""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "application/pdf",
                            "data": b64_pdf
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    logger.info("Calling Gemini 2.0 Flash Multimodal Vision API...")
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(content)
            logger.info(f"Gemini successfully extracted {len(parsed.get('extracted_rules', []))} rules!")
            return parsed
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        logger.error(f"Gemini API HTTP Error {e.code}: {err_body}")
        raise
    except Exception as e:
        logger.error(f"Error communicating with Gemini: {e}")
        raise

def main():
    parser = argparse.ArgumentParser(description="Department of Consumer Affairs Gazette PDF Ingestion Pipeline")
    parser.add_argument("--list", action="store_true", help="List all official Consumer Affairs Legal Metrology PDFs")
    parser.add_argument("--download", type=str, help="Download a document by its ID (e.g., lmpc_rules_2011_base)")
    parser.add_argument("--process", type=str, help="Process a local PDF file using Gemini multimodal bilingual extraction")
    parser.add_argument("--output", type=str, default="extracted_rules.json", help="Output JSON path for extracted rules")

    args = parser.parse_args()

    if args.list:
        print("\n" + "="*80)
        print("DEPARTMENT OF CONSUMER AFFAIRS — OFFICIAL LEGAL METROLOGY REPOSITORY")
        print("Source: https://consumeraffairs.gov.in/pages/legal-metrology-act")
        print("="*80 + "\n")
        for doc in OFFICIAL_CONSUMER_AFFAIRS_CATALOG:
            print(f"[{doc['id']}] ({doc['year']}) - {doc['category']}")
            print(f"  English: {doc['title']}")
            print(f"  हिन्दी:   {doc['title_hindi']}")
            print(f"  URL:     {doc['url']}")
            print(f"  Focus:   {doc['significance']}\n")
        return

    if args.download:
        match = next((d for d in OFFICIAL_CONSUMER_AFFAIRS_CATALOG if d["id"] == args.download), None)
        if not match:
            print(f"Error: Unknown document ID '{args.download}'. Run with --list to view valid IDs.")
            sys.exit(1)
        dest = f"{args.download}.pdf"
        download_pdf(match["url"], dest)
        print(f"\nSaved to {dest}. You can now run:")
        print(f"python backend/scripts/sync_consumeraffairs_gazette.py --process {dest}")
        return

    if args.process:
        result = analyze_pdf_with_gemini(args.process)
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\nExtracted {len(result.get('extracted_rules', []))} rules successfully!")
        print(f"Results written to: {args.output}")
        return

    parser.print_help()

if __name__ == "__main__":
    main()
