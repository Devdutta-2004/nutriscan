"""
Gemini-Powered Compliance Reasoning Engine for LMPC Audit Reports.

Uses Google Gemini 2.0 Flash API for context-grounded compliance analysis.
All reasoning is strictly grounded in retrieved statutory rule chunks — 
no hallucinated citations or fabricated rule references.

Falls back gracefully to None when no API key is configured,
allowing the synthesizer to use deterministic-only analysis.
"""

import json
import logging
import asyncio
import urllib.request
import urllib.parse
import urllib.error
from typing import Dict, Any, List, Optional

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False

from app.config import Settings

logger = logging.getLogger(__name__)

# Strict anti-hallucination system prompt for compliance reasoning
COMPLIANCE_SYSTEM_PROMPT = """You are a Senior Legal Metrology Inspector appointed under the Legal Metrology Act, 2009, Government of India. You are conducting a compliance audit of a packaged commodity label.

CRITICAL INSTRUCTIONS:
1. Your ONLY source of truth is the STATUTORY RULES provided below. Do NOT cite any rule, section, or provision not present in the retrieved context.
2. Do NOT hallucinate or fabricate rule numbers, gazette references, or penalty amounts.
3. For each mandatory declaration, analyze whether the extracted label data satisfies the statutory requirement.
4. Use precise legal terminology from the rules.
5. If a field is missing or ambiguous, classify it as a VIOLATION or WARNING with the specific rule reference.
6. Always include the applicable penalty provision.

OUTPUT FORMAT: You must respond with valid JSON matching the schema below. No markdown, no explanation outside the JSON.
"""

COMPLIANCE_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "mandate_id": {"type": "string", "description": "Mandate identifier (e.g., mfg_address, generic_name)"},
                    "rule_ref": {"type": "string", "description": "Exact rule reference (e.g., Rule 6(1)(a))"},
                    "status": {"type": "string", "enum": ["COMPLIANT", "WARNING", "VIOLATION"]},
                    "reasoning": {"type": "string", "description": "Detailed legal reasoning grounded in retrieved rules"},
                    "verbatim_citation": {"type": "string", "description": "Exact text quoted from the statutory rule"},
                    "corrective_action": {"type": "string", "description": "Recommended action to achieve compliance"},
                    "penalty_ref": {"type": "string", "description": "Applicable penalty provision"}
                },
                "required": ["mandate_id", "rule_ref", "status", "reasoning", "penalty_ref"]
            }
        },
        "overall_assessment": {
            "type": "string",
            "description": "Executive summary of compliance status"
        },
        "improvement_notice_warranted": {
            "type": "boolean",
            "description": "Whether a formal Improvement Notice under Section 36 is warranted"
        },
        "total_penalty_exposure": {
            "type": "string",
            "description": "Maximum aggregate penalty exposure (e.g., 'Up to ₹25,000 under Rule 32')"
        }
    },
    "required": ["findings", "overall_assessment", "improvement_notice_warranted"]
}


class GeminiComplianceEngine:
    """
    Lightweight Gemini API client for context-grounded compliance reasoning.
    
    Uses httpx for async HTTP calls to the Gemini REST API directly,
    avoiding the heavy google-generativeai SDK. Designed for Vercel serverless.
    """

    def __init__(self):
        self._api_key = Settings.GEMINI_API_KEY
        self._model = Settings.GEMINI_MODEL
        self._base_url = Settings.GEMINI_API_BASE

    @property
    def is_available(self) -> bool:
        """Check if Gemini API key is configured and non-empty."""
        return Settings.is_gemini_available()

    def _call_gemini_urllib(self, url: str, params: dict, payload: dict) -> Optional[dict]:
        """Synchronous urllib POST to Gemini API (run via asyncio.to_thread)."""
        full_url = f"{url}?{urllib.parse.urlencode(params)}"
        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            full_url,
            data=req_data,
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=60.0) as resp:
                if resp.status != 200:
                    logger.warning(f"Gemini API returned status {resp.status}")
                    return None
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            logger.warning(f"Gemini API urllib call failed: {e}")
            return None

    def _build_prompt(
        self,
        label_data: Dict[str, Any],
        retrieved_chunks: List[Dict[str, Any]],
        product_name: str
    ) -> str:
        """
        Builds the context-grounded prompt with retrieved statutory rules
        and extracted label data.
        """
        # Format retrieved rules
        rules_text = ""
        for i, chunk in enumerate(retrieved_chunks, 1):
            rules_text += f"\n--- STATUTORY RULE {i} ---\n"
            rules_text += f"ID: {chunk.get('id', 'N/A')}\n"
            rules_text += f"Title: {chunk.get('title', 'N/A')}\n"
            rules_text += f"Act/Rule: {chunk.get('act_rule', 'N/A')}\n"
            rules_text += f"Gazette Reference: {chunk.get('gazette_ref', 'N/A')}\n"
            rules_text += f"Verbatim Text: {chunk.get('verbatim_text', 'N/A')}\n"
            rules_text += f"Officer Guidance: {chunk.get('officer_guidance', 'N/A')}\n"
            rules_text += f"Penalty: {chunk.get('penalty_rule', 'N/A')}\n"
            if chunk.get('effective_date'):
                rules_text += f"Effective Date: {chunk['effective_date']}\n"

        # Format label data
        label_text = f"\nProduct Name: {product_name}\n"
        field_labels = {
            "generic_name": "Generic/Common Name",
            "net_quantity": "Net Quantity",
            "mrp": "Maximum Retail Price (MRP)",
            "unit_sale_price": "Unit Sale Price (USP)",
            "mfg_date": "Date of Manufacture/Packing",
            "expiry_date": "Best Before / Expiry Date",
            "manufacturer_address": "Manufacturer Address",
            "importer_address": "Importer Address",
            "consumer_care_phone": "Consumer Care Phone",
            "consumer_care_email": "Consumer Care Email",
            "country_of_origin": "Country of Origin",
            "language_detected": "Language(s) Detected",
        }
        for key, label in field_labels.items():
            value = label_data.get(key, "NOT DETECTED / MISSING")
            if not value or str(value).strip().lower() in ["", "none", "missing", "n/a"]:
                value = "NOT DETECTED / MISSING"
            label_text += f"  {label}: {value}\n"

        prompt = f"""
RETRIEVED STATUTORY RULES (Your ONLY source of truth):
{rules_text}

EXTRACTED LABEL DATA FROM PACKAGED COMMODITY:
{label_text}

TASK: Analyze each mandatory declaration field against the applicable statutory rules.
For each finding, cite the EXACT rule number and quote relevant verbatim statutory text.
Classify each as COMPLIANT, WARNING, or VIOLATION.
State the applicable penalty under Rule 32 / Section 36 of the LM Act, 2009.

Respond with valid JSON matching the required schema. Do NOT include any text outside the JSON object.
"""
        return prompt

    async def analyze_compliance(
        self,
        label_data: Dict[str, Any],
        retrieved_chunks: List[Dict[str, Any]],
        product_name: str = "Packaged Commodity"
    ) -> Optional[Dict[str, Any]]:
        """
        Sends label data and retrieved statutory chunks to Gemini for
        context-grounded compliance analysis.
        
        Returns structured findings dict, or None if API is unavailable/errors.
        """
        if not self.is_available:
            logger.info("Gemini API not available — skipping LLM synthesis")
            return None

        prompt = self._build_prompt(label_data, retrieved_chunks, product_name)

        # Build Gemini API request
        url = f"{self._base_url}/models/{self._model}:generateContent"
        params = {"key": self._api_key}

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": COMPLIANCE_SYSTEM_PROMPT + "\n\n" + prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "topP": 0.8,
                "maxOutputTokens": 4096,
                "responseMimeType": "application/json",
                "responseSchema": COMPLIANCE_ANALYSIS_SCHEMA,
            }
        }

        try:
            if HAS_HTTPX:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(url, params=params, json=payload)
                    if response.status_code != 200:
                        logger.warning(
                            f"Gemini API returned {response.status_code}: {response.text[:200]}"
                        )
                        return None
                    data = response.json()
            else:
                data = await asyncio.to_thread(self._call_gemini_urllib, url, params, payload)
                if not data:
                    return None

            # Extract generated text from Gemini response
            candidates = data.get("candidates", [])
            if not candidates:
                logger.warning("Gemini returned no candidates")
                return None

            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if not parts:
                logger.warning("Gemini returned empty parts")
                return None

            generated_text = parts[0].get("text", "")

            # Parse JSON response
            try:
                result = json.loads(generated_text)
                return result
            except json.JSONDecodeError:
                logger.warning(f"Failed to parse Gemini JSON response: {generated_text[:200]}")
                return None

        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}")
            return None

    async def extract_label_from_image(
        self,
        image_bytes: bytes,
        mime_type: str = "image/jpeg"
    ) -> Optional[Dict[str, Any]]:
        """
        Multimodal Perception: Uses Gemini Vision to read raw text from packaging image
        without hallucinating compliance judgments.
        Returns extracted key-value fields for the deterministic engine to judge.
        """
        if not self.is_available:
            logger.info("Gemini API not available — skipping multimodal vision extraction")
            return None

        import base64
        b64_data = base64.b64encode(image_bytes).decode("utf-8")

        vision_prompt = """You are an OCR and Packaging Text Transcription System for Indian pre-packaged commodities.
Read all printed text from this packaging image carefully, including text on curves, folds, reflective plastic, or barcode areas.

Transcribe and extract the following exact fields if present on the label:
- generic_name: The common or generic commodity name (e.g., 'RATLAMI SEV', 'POTATO CHIPS'). NOT just the brand logo.
- net_quantity: The declared net quantity or weight in SI units (e.g., '200 g', '100 ml', '1 N'). Do NOT use 'per 100g' from the nutrition table.
- mrp: Maximum retail price (e.g., 'Rs. 55.00' or '₹55.00 (INCL. OF ALL TAXES)').
- unit_sale_price: Unit sale price if printed (e.g., 'Rs. 0.28 per g' or '₹0.28 / g').
- mfg_date: Date/month of packaging, manufacture, or import (e.g., '09/08/2026', 'AUG 2026').
- expiry_date: Best before date, expiry date, or use-by date (e.g., 'Best Before 6 Months', '2027-01-05').
- manufacturer_address: Complete name and address of manufacturer, packer, or marketer, including PIN code.
- importer_address: Complete name and address of Indian importer if imported product.
- consumer_care_phone: Helpline or customer care phone number.
- consumer_care_email: Official customer care email address.
- country_of_origin: Declared country of manufacture/origin (e.g., 'India', 'Malaysia').
- language_detected: Primary language of printed text (e.g., 'English', 'Hindi').
- mrp_values: List of distinct MRP prices if more than one is printed on the package.

Respond with valid JSON matching the schema below. If a field is not visible in this image crop, return null for that field. Do not invent details."""

        vision_schema = {
            "type": "object",
            "properties": {
                "generic_name": {"type": ["string", "null"]},
                "net_quantity": {"type": ["string", "null"]},
                "mrp": {"type": ["string", "null"]},
                "unit_sale_price": {"type": ["string", "null"]},
                "mfg_date": {"type": ["string", "null"]},
                "expiry_date": {"type": ["string", "null"]},
                "manufacturer_address": {"type": ["string", "null"]},
                "importer_address": {"type": ["string", "null"]},
                "consumer_care_phone": {"type": ["string", "null"]},
                "consumer_care_email": {"type": ["string", "null"]},
                "country_of_origin": {"type": ["string", "null"]},
                "language_detected": {"type": ["string", "null"]},
                "mrp_values": {"type": "array", "items": {"type": "string"}},
                "raw_text_summary": {"type": "string", "description": "Complete transcription of all text blocks visible"}
            },
            "required": ["generic_name", "net_quantity", "mrp"]
        }

        url = f"{self._base_url}/models/{self._model}:generateContent"
        params = {"key": self._api_key}

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": vision_prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": b64_data
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.0,
                "topP": 0.8,
                "maxOutputTokens": 2048,
                "responseMimeType": "application/json",
            }
        }

    async def extract_label_from_images(
        self,
        images: List[tuple[bytes, str]]
    ) -> Optional[Dict[str, Any]]:
        """
        Multi-Image Multimodal Perception:
        Accepts multiple photos of the SAME product (e.g. Front display panel + Back details + Side flap).
        Sends all images together to Gemini Vision in a single multimodal turn so declarations scattered
        across different panels (MRP on top/bottom, Net Qty on front, Consumer Care on back) are all synthesized.
        """
        if not self.is_available or not images:
            return None

        import base64

        vision_prompt = """You are an OCR and Packaging Text Transcription System for Indian pre-packaged commodities.
You are given MULTIPLE images/panels of the SAME physical product package (e.g., front panel, back information panel, side panel, top/bottom flap).

Combine and transcribe all visible statutory declarations from ALL provided images into a single unified JSON:
- generic_name: Common or generic commodity name (e.g., 'RATLAMI SEV', 'POTATO CHIPS'). NOT just the brand logo.
- net_quantity: The declared net quantity or weight in standard metric SI units (e.g., '200 g', '100 ml', '1 N'). Do NOT use 'per 100g' from the nutrition table.
- mrp: Maximum retail price (e.g., 'Rs. 55.00' or '₹55.00 (INCL. OF ALL TAXES)').
- unit_sale_price: Unit sale price if printed (e.g., 'Rs. 0.28 per g' or '₹0.28 / g').
- mfg_date: Date/month of packaging, manufacture, or import (e.g., '09/08/2026', 'AUG 2026').
- expiry_date: Best before date, expiry date, or use-by period (e.g., 'Best Before 6 Months', '2027-01-05').
- manufacturer_address: Complete name and address of manufacturer, packer, or marketer, including 6-digit postal PIN code.
- importer_address: Complete name and address of registered Indian importer with PIN code (if imported product).
- consumer_care_phone: Helpline or customer service phone/telephone number.
- consumer_care_email: Official customer care email address.
- country_of_origin: Declared country of origin/manufacture (e.g., 'India', 'Malaysia').
- language_detected: Primary language of printed statutory declarations (e.g., 'English', 'Hindi').
- mrp_values: List of all distinct MRP prices printed across any of the panels.

Respond with valid JSON. If a declaration cannot be found on ANY of the provided images, return null for that field. Do not fabricate details."""

        # Build parts array with prompt + all image objects
        parts: List[Dict[str, Any]] = [{"text": vision_prompt}]
        for idx, (img_bytes, mime_type) in enumerate(images, 1):
            b64_data = base64.b64encode(img_bytes).decode("utf-8")
            parts.append({
                "inline_data": {
                    "mime_type": mime_type or "image/jpeg",
                    "data": b64_data
                }
            })

        url = f"{self._base_url}/models/{self._model}:generateContent"
        params = {"key": self._api_key}

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": parts
                }
            ],
            "generationConfig": {
                "temperature": 0.0,
                "topP": 0.8,
                "maxOutputTokens": 2048,
                "responseMimeType": "application/json",
            }
        }

        try:
            if HAS_HTTPX:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    response = await client.post(url, params=params, json=payload)
                    if response.status_code != 200:
                        logger.warning(f"Gemini Multi-Vision API returned {response.status_code}: {response.text[:200]}")
                        return None
                    data = response.json()
            else:
                data = await asyncio.to_thread(self._call_gemini_urllib, url, params, payload)
                if not data:
                    return None

            candidates = data.get("candidates", [])
            if not candidates:
                return None

            content = candidates[0].get("content", {})
            p_list = content.get("parts", [])
            if not p_list:
                return None

            generated_text = p_list[0].get("text", "")
            return json.loads(generated_text)

        except Exception as e:
            logger.warning(f"Gemini Multi-Vision extraction failed: {e}")
            return None


# Global singleton
gemini_engine = GeminiComplianceEngine()
