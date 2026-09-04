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
            with urllib.request.urlopen(req, timeout=30.0) as resp:
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


# Global singleton
gemini_engine = GeminiComplianceEngine()
