"""
Big-8 Mandatory Compliance Checker under Legal Metrology (Packaged Commodities) Rules, 2011.
Evaluates the 8 core statutory declarations, detects importer requirements, and flags defects.
"""

from typing import Dict, Any, List, Optional
from app.compliance.math_engine import DeterministicMathEngine
import re

class Big8Checker:
    """
    Validates the 8 mandatory declarations required on retail packages.
    """

    MANDATES = [
        {"id": "mfg_address", "name": "Manufacturer / Importer Address", "rule": "Rule 6(1)(a)"},
        {"id": "generic_name", "name": "Generic or Common Name", "rule": "Rule 6(1)(b)"},
        {"id": "net_quantity", "name": "Net Quantity (Standard SI Units)", "rule": "Rule 6(1)(c)"},
        {"id": "mrp", "name": "Maximum Retail Price (Incl. of all taxes)", "rule": "Rule 6(1)(d)"},
        {"id": "mfg_date", "name": "Date of Manufacture / Packing", "rule": "Rule 6(1)(e)"},
        {"id": "usp", "name": "Unit Sale Price (USP)", "rule": "Rule 6(1)(s)"},
        {"id": "consumer_care", "name": "Consumer Care Details (Phone & Email)", "rule": "Rule 6(1)(h)"},
        {"id": "country_of_origin", "name": "Country of Origin & Importer", "rule": "Rule 6(1)(g)"},
    ]

    @classmethod
    def evaluate(cls, label_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs comprehensive Big-8 checks on extracted or declared label attributes.
        """
        results: List[Dict[str, Any]] = []
        violations_count = 0
        warnings_count = 0
        compliant_count = 0

        # 1. Manufacturer / Importer Address (Rule 6(1)(a))
        mfg_val = label_data.get("manufacturer_address", "")
        importer_val = label_data.get("importer_address", "")
        country = label_data.get("country_of_origin", "India")
        is_imported = country and country.strip().lower() not in ["india", "in", "ind", "bharat"]

        if is_imported:
            if not importer_val or importer_val.strip().lower() in ["missing", "none", ""]:
                results.append({
                    "mandate_id": "mfg_address",
                    "name": "Importer Name & Address",
                    "rule": "Rule 6(1)(a) & 6(1)(g)",
                    "status": "VIOLATION",
                    "extracted_text": mfg_val or "Foreign Manufacturer only",
                    "reason": f"Imported commodity from '{country}' requires name and complete postal address of the Indian Importer.",
                    "severity": "HIGH",
                    "citation_key": "rule_6_1_a"
                })
                violations_count += 1
            else:
                results.append({
                    "mandate_id": "mfg_address",
                    "name": "Manufacturer & Importer Address",
                    "rule": "Rule 6(1)(a)",
                    "status": "COMPLIANT",
                    "extracted_text": f"Mfg: {mfg_val} | Importer: {importer_val}",
                    "reason": "Both foreign manufacturer and registered Indian importer postal details declared.",
                    "severity": "LOW",
                    "citation_key": "rule_6_1_a"
                })
                compliant_count += 1
        else:
            if not mfg_val or len(mfg_val.strip()) < 8:
                results.append({
                    "mandate_id": "mfg_address",
                    "name": "Manufacturer Address",
                    "rule": "Rule 6(1)(a)",
                    "status": "VIOLATION",
                    "extracted_text": mfg_val or "Missing",
                    "reason": "Complete postal address of manufacturer is missing or incomplete.",
                    "severity": "HIGH",
                    "citation_key": "rule_6_1_a"
                })
                violations_count += 1
            else:
                results.append({
                    "mandate_id": "mfg_address",
                    "name": "Manufacturer Address",
                    "rule": "Rule 6(1)(a)",
                    "status": "COMPLIANT",
                    "extracted_text": mfg_val,
                    "reason": "Manufacturer postal address properly declared.",
                    "severity": "LOW",
                    "citation_key": "rule_6_1_a"
                })
                compliant_count += 1

        # 2. Generic Name (Rule 6(1)(b))
        gen_name = label_data.get("generic_name", "")
        if not gen_name or gen_name.strip().lower() in ["missing", "none"]:
            results.append({
                "mandate_id": "generic_name",
                "name": "Generic or Common Name",
                "rule": "Rule 6(1)(b)",
                "status": "VIOLATION",
                "extracted_text": "Missing",
                "reason": "Generic or common name of commodity is omitted.",
                "severity": "HIGH",
                "citation_key": "rule_6_1_b"
            })
            violations_count += 1
        else:
            results.append({
                "mandate_id": "generic_name",
                "name": "Generic or Common Name",
                "rule": "Rule 6(1)(b)",
                "status": "COMPLIANT",
                "extracted_text": gen_name,
                "reason": f"Generic name declared: '{gen_name}'.",
                "severity": "LOW",
                "citation_key": "rule_6_1_b"
            })
            compliant_count += 1

        # 3. Net Quantity (Rule 6(1)(c))
        net_qty = label_data.get("net_quantity", "")
        parsed_qty = DeterministicMathEngine.parse_quantity(net_qty)
        if not parsed_qty:
            results.append({
                "mandate_id": "net_quantity",
                "name": "Net Quantity",
                "rule": "Rule 6(1)(c)",
                "status": "VIOLATION",
                "extracted_text": net_qty or "Missing",
                "reason": "Net quantity not declared in standard metric units (g, kg, ml, L, or piece).",
                "severity": "HIGH",
                "citation_key": "rule_6_1_c"
            })
            violations_count += 1
        else:
            results.append({
                "mandate_id": "net_quantity",
                "name": "Net Quantity",
                "rule": "Rule 6(1)(c)",
                "status": "COMPLIANT",
                "extracted_text": net_qty,
                "reason": f"Standard metric unit declared ({parsed_qty[0]} {parsed_qty[1]}).",
                "severity": "LOW",
                "citation_key": "rule_6_1_c"
            })
            compliant_count += 1

        # 4. Maximum Retail Price (Rule 6(1)(d))
        mrp = label_data.get("mrp", "")
        parsed_mrp = DeterministicMathEngine.parse_price(mrp)
        if not parsed_mrp:
            results.append({
                "mandate_id": "mrp",
                "name": "Maximum Retail Price (MRP)",
                "rule": "Rule 6(1)(d)",
                "status": "VIOLATION",
                "extracted_text": mrp or "Missing",
                "reason": "MRP must be clearly declared inclusive of all taxes.",
                "severity": "HIGH",
                "citation_key": "rule_6_1_d"
            })
            violations_count += 1
        else:
            # Check for tax inclusion declaration
            raw_mrp_str = str(mrp).lower()
            tax_declared = "incl" in raw_mrp_str or "taxes" in raw_mrp_str or label_data.get("mrp_inclusive_taxes", True)
            if not tax_declared:
                results.append({
                    "mandate_id": "mrp",
                    "name": "Maximum Retail Price (MRP)",
                    "rule": "Rule 6(1)(d)",
                    "status": "WARNING",
                    "extracted_text": mrp,
                    "reason": "Mandatory statement 'inclusive of all taxes' or 'incl. of all taxes' is ambiguous.",
                    "severity": "MEDIUM",
                    "citation_key": "rule_6_1_d"
                })
                warnings_count += 1
            else:
                results.append({
                    "mandate_id": "mrp",
                    "name": "Maximum Retail Price (MRP)",
                    "rule": "Rule 6(1)(d)",
                    "status": "COMPLIANT",
                    "extracted_text": f"₹{parsed_mrp:.2f} (inclusive of all taxes)",
                    "reason": "MRP with mandatory tax inclusion declared.",
                    "severity": "LOW",
                    "citation_key": "rule_6_1_d"
                })
                compliant_count += 1

        # 5. Date of Manufacture / Packing (Rule 6(1)(e))
        mfg_date = label_data.get("mfg_date", "")
        date_audit = DeterministicMathEngine.verify_date_format(mfg_date)
        if date_audit["status"] == "VIOLATION":
            results.append({
                "mandate_id": "mfg_date",
                "name": "Date of Manufacture / Packing",
                "rule": "Rule 6(1)(e)",
                "status": "VIOLATION",
                "extracted_text": mfg_date or "Missing",
                "reason": date_audit["reason"],
                "severity": "HIGH",
                "citation_key": "rule_6_1_e"
            })
            violations_count += 1
        elif date_audit["status"] == "WARNING":
            results.append({
                "mandate_id": "mfg_date",
                "name": "Date of Manufacture / Packing",
                "rule": "Rule 6(1)(e)",
                "status": "WARNING",
                "extracted_text": mfg_date,
                "reason": date_audit["reason"],
                "severity": "MEDIUM",
                "citation_key": "rule_6_1_e"
            })
            warnings_count += 1
        else:
            results.append({
                "mandate_id": "mfg_date",
                "name": "Date of Manufacture / Packing",
                "rule": "Rule 6(1)(e)",
                "status": "COMPLIANT",
                "extracted_text": mfg_date,
                "reason": date_audit["reason"],
                "severity": "LOW",
                "citation_key": "rule_6_1_e"
            })
            compliant_count += 1

        # 6. Unit Sale Price (Rule 6(1)(s) - 2024 Amendment)
        usp_str = label_data.get("unit_sale_price", "")
        usp_verification = DeterministicMathEngine.verify_usp(mrp, net_qty, usp_str)
        if usp_verification["status"] == "VIOLATION":
            results.append({
                "mandate_id": "usp",
                "name": "Unit Sale Price (USP)",
                "rule": "Rule 6(1)(s)",
                "status": "VIOLATION",
                "extracted_text": usp_str or "Missing",
                "reason": usp_verification["reason"],
                "severity": "HIGH",
                "details": usp_verification,
                "citation_key": "rule_6_1_s"
            })
            violations_count += 1
        elif usp_verification["status"] == "WARNING":
            results.append({
                "mandate_id": "usp",
                "name": "Unit Sale Price (USP)",
                "rule": "Rule 6(1)(s)",
                "status": "WARNING",
                "extracted_text": usp_str,
                "reason": usp_verification["reason"],
                "severity": "MEDIUM",
                "details": usp_verification,
                "citation_key": "rule_6_1_s"
            })
            warnings_count += 1
        else:
            results.append({
                "mandate_id": "usp",
                "name": "Unit Sale Price (USP)",
                "rule": "Rule 6(1)(s)",
                "status": "COMPLIANT",
                "extracted_text": usp_verification.get("printed", usp_str),
                "reason": usp_verification["reason"],
                "severity": "LOW",
                "details": usp_verification,
                "citation_key": "rule_6_1_s"
            })
            compliant_count += 1

        # 7. Consumer Care Details (Rule 6(1)(h))
        care_phone = label_data.get("consumer_care_phone", "")
        care_email = label_data.get("consumer_care_email", "")
        has_phone = bool(re.search(r'[\d\-\+\(\)]{7,}', care_phone))
        has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', care_email))

        if not has_phone and not has_email:
            results.append({
                "mandate_id": "consumer_care",
                "name": "Consumer Care Details",
                "rule": "Rule 6(1)(h)",
                "status": "VIOLATION",
                "extracted_text": "Missing phone & email",
                "reason": "Both telephone number and email address for consumer complaints are missing.",
                "severity": "HIGH",
                "citation_key": "rule_6_1_h"
            })
            violations_count += 1
        elif not has_phone or not has_email:
            missing_item = "email address" if not has_email else "telephone number"
            results.append({
                "mandate_id": "consumer_care",
                "name": "Consumer Care Details",
                "rule": "Rule 6(1)(h)",
                "status": "WARNING",
                "extracted_text": f"Phone: {care_phone or 'Missing'} | Email: {care_email or 'Missing'}",
                "reason": f"Rule 6(1)(h) mandates both telephone and email. Missing {missing_item}.",
                "severity": "MEDIUM",
                "citation_key": "rule_6_1_h"
            })
            warnings_count += 1
        else:
            results.append({
                "mandate_id": "consumer_care",
                "name": "Consumer Care Details",
                "rule": "Rule 6(1)(h)",
                "status": "COMPLIANT",
                "extracted_text": f"Tel: {care_phone} | Email: {care_email}",
                "reason": "Complete contact details for consumer redressal declared.",
                "severity": "LOW",
                "citation_key": "rule_6_1_h"
            })
            compliant_count += 1

        # 8. Country of Origin (Rule 6(1)(g))
        if not country or country.strip().lower() in ["missing", "none"]:
            results.append({
                "mandate_id": "country_of_origin",
                "name": "Country of Origin",
                "rule": "Rule 6(1)(g)",
                "status": "VIOLATION",
                "extracted_text": "Missing",
                "reason": "Country of origin must be declared on all pre-packed commodities.",
                "severity": "HIGH",
                "citation_key": "rule_6_1_g"
            })
            violations_count += 1
        else:
            results.append({
                "mandate_id": "country_of_origin",
                "name": "Country of Origin",
                "rule": "Rule 6(1)(g)",
                "status": "COMPLIANT",
                "extracted_text": country,
                "reason": f"Country of origin explicitly declared as '{country}'.",
                "severity": "LOW",
                "citation_key": "rule_6_1_g"
            })
            compliant_count += 1

        # Calculate overall compliance score (0 - 100%)
        # Violations subtract 12.5%, warnings subtract 5%
        raw_score = 100 - (violations_count * 12.5) - (warnings_count * 5.0)
        compliance_score = max(0, min(100, int(round(raw_score))))

        return {
            "compliance_score": compliance_score,
            "checklist": results,
            "summary": {
                "total_mandates": len(cls.MANDATES),
                "compliant": compliant_count,
                "warnings": warnings_count,
                "violations": violations_count,
                "is_lawful_for_sale": violations_count == 0
            },
            "usp_verification": usp_verification
        }
