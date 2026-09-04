import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.compliance.math_engine import DeterministicMathEngine
from app.compliance.big8_checker import Big8Checker
from app.rag.gazette_db import gazette_rag_engine
from app.compliance.synthesizer import AuditSynthesizer

def test_usp_calculations():
    print("\n--- Testing Deterministic Math Engine (Rule 6(1)(s)) ---")

    # 1. Compliant 400g biscuit pack (₹80)
    calc1 = DeterministicMathEngine.verify_usp(
        mrp_str="₹80.00",
        qty_str="400g",
        printed_usp_str="₹0.20/g"
    )
    assert calc1["status"] == "COMPLIANT", f"Expected COMPLIANT, got {calc1['status']}"
    assert calc1["is_valid"] is True
    print("✓ Compliant 400g (₹80 -> ₹0.20/g): PASS")

    # 2. USP Mismatch (₹80 for 400g but printed ₹0.35/g)
    calc2 = DeterministicMathEngine.verify_usp(
        mrp_str="₹80.00",
        qty_str="400g",
        printed_usp_str="₹0.35/g"
    )
    assert calc2["status"] == "VIOLATION"
    assert calc2["is_valid"] is False
    assert "differs from calculated" in calc2["reason"]
    print("✓ USP Mismatch detection (Printed ₹0.35 vs Calc ₹0.20): PASS")

    # 3. Missing USP
    calc3 = DeterministicMathEngine.verify_usp(
        mrp_str="₹450.00",
        qty_str="50ml",
        printed_usp_str=""
    )
    assert calc3["status"] == "VIOLATION"
    assert calc3["is_valid"] is False
    assert "missing completely" in calc3["reason"].lower()
    print("✓ Missing USP violation detection: PASS")

    # 4. Standard unit normalizer: >= 1kg -> ₹/kg
    calc4 = DeterministicMathEngine.calculate_expected_usp(
        mrp=300.0,
        net_qty=1.5,
        unit="kg"
    )
    assert calc4["expected_usp_unit"] == "kg"
    assert calc4["expected_usp_value"] == 200.0
    print("✓ Bulk unit conversion (1.5kg @ ₹300 = ₹200.00/kg): PASS")

    # 5. Volume < 1000ml -> ₹/ml or ₹/100ml
    calc5 = DeterministicMathEngine.calculate_expected_usp(
        mrp=450.0,
        net_qty=50,
        unit="ml"
    )
    assert calc5["expected_usp_unit"] == "ml"
    assert calc5["expected_usp_value"] == 9.0
    assert calc5["alt_usp_value"] == 900.0
    print("✓ Liquid volume conversion (50ml @ ₹450 = ₹9.00/ml or ₹900.00/100ml): PASS")

def test_big8_checker():
    print("\n--- Testing Big-8 Statutory Checker ---")
    
    # Imported product without importer address
    sample_imported = {
        "generic_name": "Dark Chocolate",
        "net_quantity": "100g",
        "mrp": "₹350.00",
        "unit_sale_price": "₹3.50/g",
        "mfg_date": "11/2023",
        "manufacturer_address": "Alpine Chocolatier, Zurich, Switzerland",
        "importer_address": "",
        "consumer_care_phone": "+41-44-211-0000",
        "consumer_care_email": "",
        "country_of_origin": "Switzerland"
    }
    eval_result = Big8Checker.evaluate(sample_imported)
    violations = [c for c in eval_result["checklist"] if c["status"] == "VIOLATION"]
    warnings = [c for c in eval_result["checklist"] if c["status"] == "WARNING"]
    assert len(violations) >= 1, f"Expected at least 1 violation, got {len(violations)}"
    assert any(v["mandate_id"] == "mfg_address" for v in violations)
    assert len(warnings) >= 1, f"Expected at least 1 warning for missing email, got {len(warnings)}"
    assert any(w["mandate_id"] == "consumer_care" for w in warnings)
    print(f"✓ Imported product missing importer detected (Score: {eval_result['compliance_score']}%): PASS")

    # Test complete absence of consumer care
    sample_imported["consumer_care_phone"] = ""
    eval_result2 = Big8Checker.evaluate(sample_imported)
    violations2 = [c for c in eval_result2["checklist"] if c["status"] == "VIOLATION"]
    assert len(violations2) >= 2
    print("✓ Full absence of consumer care flagged as VIOLATION: PASS")

def test_gazette_rag():
    print("\n--- Testing Gazette RAG Engine ---")
    
    # Query USP
    results = gazette_rag_engine.search("unit sale price mandate missing on label", top_k=2)
    assert len(results) > 0
    top_rule = results[0]
    assert "rule_6_1_s" in top_rule["id"] or "usp" in top_rule["tags"]
    print(f"✓ Gazette RAG retrieved: '{top_rule['title']}' (Score: {top_rule['relevance_score']}): PASS")

    # Query Manufacturer/Importer
    results_mfg = gazette_rag_engine.search("foreign manufacturer postal address importer pin code", top_k=2)
    assert len(results_mfg) > 0
    assert any("rule_6_1_a" in r["id"] or "manufacturer" in r["tags"] for r in results_mfg)
    print(f"✓ Gazette RAG retrieved importer mandate: '{results_mfg[0]['title']}': PASS")

def test_audit_synthesizer():
    print("\n--- Testing Audit Synthesizer (11 Mandates + RAG Grounding) ---")
    report = AuditSynthesizer.synthesize_report(
        product_name="Test Product",
        label_data={
            "generic_name": "Test Snack",
            "net_quantity": "200g",
            "mrp": "₹50.00 (incl. of all taxes)",
            "unit_sale_price": "₹0.25/g",
            "mfg_date": "04/2024",
            "expiry_date": "10/2024",
            "manufacturer_address": "Test Foods Ltd, Industrial Estate, Mumbai 400001",
            "consumer_care_phone": "1800-123-4567",
            "consumer_care_email": "care@testfoods.com",
            "country_of_origin": "India",
            "language_detected": "English"
        }
    )
    assert report["compliance_score"] == 100, f"Expected 100, got {report['compliance_score']}"
    assert report["legal_status"] == "FULLY_COMPLIANT", f"Expected FULLY_COMPLIANT, got {report['legal_status']}"
    assert len(report["checklist"]) == 11, f"Expected 11 mandates, got {len(report['checklist'])}"
    assert report["summary"]["total_mandates_checked"] == 11
    assert "gazette_citation" in report["checklist"][0]
    print("✓ Full Audit Synthesizer report generation (11 Mandates, RAG Grounded): PASS (Score: 100%)")

def test_new_mandates():
    print("\n--- Testing New Statutory Mandates (Expiry, Language, Dual MRP) ---")
    
    # Dual MRP detection
    dual_mrp_data = {
        "generic_name": "Soda Can",
        "net_quantity": "300ml",
        "mrp": "₹40.00 (incl. of all taxes)",
        "mrp_values": ["₹40.00", "₹60.00"],
        "unit_sale_price": "₹0.13/ml",
        "mfg_date": "05/2024",
        "manufacturer_address": "Beverages India Pvt Ltd, Delhi 110001",
        "consumer_care_phone": "1800-000-1111",
        "consumer_care_email": "help@bev.in",
        "country_of_origin": "India",
        "language_detected": "English"
    }
    dual_eval = Big8Checker.evaluate(dual_mrp_data)
    dual_item = next(c for c in dual_eval["checklist"] if c["mandate_id"] == "dual_mrp")
    assert dual_item["status"] == "VIOLATION"
    assert "Dual MRP" in dual_item["name"]
    print("✓ Dual MRP violation detection (Rule 18(2A)): PASS")

    # PIN code missing in manufacturer address
    no_pin_data = {
        "generic_name": "Wafer Biscuit",
        "net_quantity": "50g",
        "mrp": "₹20.00 (incl. of all taxes)",
        "unit_sale_price": "₹0.40/g",
        "mfg_date": "05/2024",
        "manufacturer_address": "Wafer Works, Near Railway Crossing, Surat",
        "consumer_care_phone": "1800-000-1111",
        "consumer_care_email": "help@wafer.in",
        "country_of_origin": "India",
        "language_detected": "English"
    }
    pin_eval = Big8Checker.evaluate(no_pin_data)
    mfg_item = next(c for c in pin_eval["checklist"] if c["mandate_id"] == "mfg_address")
    assert mfg_item["status"] == "WARNING"
    assert "PIN" in mfg_item["reason"]
    print("✓ Manufacturer address missing PIN code warning (Rule 10): PASS")

if __name__ == "__main__":
    test_usp_calculations()
    test_big8_checker()
    test_gazette_rag()
    test_audit_synthesizer()
    test_new_mandates()
    print("\n🎉 ALL 11 MANDATE, USP & HYBRID RAG GAZETTE TESTS PASSED!")
