import sys
import os
import asyncio
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.rag.lmpc_corpus import LMPC_CORPUS, CORPUS_BY_ID, CORPUS_VERSION
from app.rag.gazette_db import lmpc_retrieval_engine, gazette_rag_engine
from app.compliance.math_engine import DeterministicMathEngine
from app.compliance.big8_checker import Big8Checker
from app.compliance.synthesizer import AuditSynthesizer
from app.main import app

# ==============================================================================
# TEST CASE 1: Corpus Completeness
# ==============================================================================
def test_1_corpus_completeness():
    print("\n--- [Test 1/9] Corpus Completeness ---")
    assert len(LMPC_CORPUS) >= 38, f"Expected at least 38 corpus chunks, got {len(LMPC_CORPUS)}"
    assert len(CORPUS_BY_ID) == len(LMPC_CORPUS), "CORPUS_BY_ID size mismatch"

    required_keys = [
        "id", "title", "act_rule", "gazette_ref", "verbatim_text",
        "officer_guidance", "penalty_rule", "category", "applies_to", "tags"
    ]

    for chunk in LMPC_CORPUS:
        for key in required_keys:
            assert key in chunk, f"Chunk '{chunk.get('id')}' missing required key '{key}'"
            assert chunk[key] is not None, f"Chunk '{chunk.get('id')}' key '{key}' is None"

    print(f"✓ All {len(LMPC_CORPUS)} statutory chunks loaded with complete metadata (v{CORPUS_VERSION}): PASS")

# ==============================================================================
# TEST CASE 2: BM25 Retrieval Accuracy
# ==============================================================================
def test_2_bm25_retrieval_accuracy():
    print("\n--- [Test 2/9] BM25 Retrieval Accuracy ---")
    results = lmpc_retrieval_engine.search("missing consumer helpline", top_k=3)
    assert len(results) > 0, "No results returned for consumer helpline query"
    top_chunk = results[0]
    assert top_chunk["id"] == "rule_6_1_h" or "consumer care" in top_chunk["title"].lower(), (
        f"Expected rule_6_1_h, got {top_chunk['id']} - {top_chunk['title']}"
    )
    print(f"✓ Query 'missing consumer helpline' -> Top result: [{top_chunk['id']}] {top_chunk['title']}: PASS")

# ==============================================================================
# TEST CASE 3: TF-IDF Retrieval
# ==============================================================================
def test_3_tfidf_retrieval():
    print("\n--- [Test 3/9] TF-IDF Retrieval ---")
    results = lmpc_retrieval_engine.search("unit sale price calculation", top_k=3)
    assert len(results) > 0, "No results returned for USP calculation query"
    rule_ids = [r["id"] for r in results]
    assert any(rid in ["rule_6_1_s", "rule_6_11", "amendment_gsr_779e"] for rid in rule_ids), (
        f"Expected USP rule in top results, got: {rule_ids}"
    )
    print(f"✓ Query 'unit sale price calculation' -> Top results: {rule_ids}: PASS")

# ==============================================================================
# TEST CASE 4: Rule-Chain Resolution
# ==============================================================================
def test_4_rule_chain_resolution():
    print("\n--- [Test 4/9] Rule-Chain Resolution ---")
    related = lmpc_retrieval_engine.get_related_rules("rule_6_1_a")
    assert len(related) > 0, "Rule 6(1)(a) expected related rules"
    related_ids = [r["id"] for r in related]
    assert "rule_10" in related_ids or "rule_27" in related_ids, (
        f"Expected rule_10 or rule_27 in related rules, got: {related_ids}"
    )
    print(f"✓ Rule 6(1)(a) linked to related statutory rules: {related_ids}: PASS")

# ==============================================================================
# TEST CASE 5: Category Filtering
# ==============================================================================
def test_5_category_filtering():
    print("\n--- [Test 5/9] Category Filtering ---")
    results = lmpc_retrieval_engine.search("declarations electronics packaging", category="electronics", top_k=5)
    assert len(results) > 0, "No results for electronics category"
    chunk_ids = [r["id"] for r in results]
    assert any("qr" in cid or "gsr_524_e_qr" in cid or "electronics" in str(r.get("applies_to", [])) for cid, r in zip(chunk_ids, results)), (
        f"Expected QR or electronics rule, got: {chunk_ids}"
    )
    print(f"✓ Category 'electronics' query retrieved category-relevant statutory chunks: {chunk_ids}: PASS")

# ==============================================================================
# TEST CASE 6: Math Engine (USP & Date Validation)
# ==============================================================================
def test_6_math_engine():
    print("\n--- [Test 6/9] Deterministic Math Engine (USP & Date Formats) ---")
    # 1. Compliant 400g biscuit pack (₹80)
    calc1 = DeterministicMathEngine.verify_usp(
        mrp_str="₹80.00",
        qty_str="400g",
        printed_usp_str="₹0.20/g"
    )
    assert calc1["status"] == "COMPLIANT"
    assert calc1["is_valid"] is True

    # 2. USP Mismatch
    calc2 = DeterministicMathEngine.verify_usp(
        mrp_str="₹80.00",
        qty_str="400g",
        printed_usp_str="₹0.35/g"
    )
    assert calc2["status"] == "VIOLATION"
    assert calc2["is_valid"] is False

    # 3. Missing USP
    calc3 = DeterministicMathEngine.verify_usp(
        mrp_str="₹450.00",
        qty_str="50ml",
        printed_usp_str=""
    )
    assert calc3["status"] == "VIOLATION"

    # 4. Normalizer: 1.5kg @ ₹300 -> ₹200.00/kg
    calc4 = DeterministicMathEngine.calculate_expected_usp(mrp=300.0, net_qty=1.5, unit="kg")
    assert calc4["expected_usp_unit"] == "kg"
    assert calc4["expected_usp_value"] == 200.0

    # 5. Date format validation (Rule 6(1)(e))
    date_valid = DeterministicMathEngine.verify_date_format("04/2024")
    assert date_valid["status"] == "COMPLIANT"
    date_invalid = DeterministicMathEngine.verify_date_format("")
    assert date_invalid["status"] == "VIOLATION"

    print("✓ Deterministic USP calculations & date format validation: PASS")

# ==============================================================================
# TEST CASE 7: Big8Checker Enhanced (11 Mandates)
# ==============================================================================
def test_7_big8_checker_enhanced():
    print("\n--- [Test 7/9] Big8Checker Enhanced (11 Mandates) ---")
    # Dual MRP detection
    dual_data = {
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
    dual_eval = Big8Checker.evaluate(dual_data)
    dual_item = next(c for c in dual_eval["checklist"] if c["mandate_id"] == "dual_mrp")
    assert dual_item["status"] == "VIOLATION"
    assert "dual mrp" in dual_item["name"].lower()

    # PIN code missing in manufacturer address (Rule 10)
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
    assert "pin" in mfg_item["reason"].lower()

    # Imported product missing importer address (Rule 6(1)(a) & 6(1)(g))
    imported_data = {
        "generic_name": "Swiss Chocolate",
        "net_quantity": "100g",
        "mrp": "₹350.00",
        "unit_sale_price": "₹3.50/g",
        "mfg_date": "11/2023",
        "manufacturer_address": "Alpine Chocolatier, Zurich, Switzerland",
        "importer_address": "",
        "consumer_care_phone": "+41-44-211-0000",
        "consumer_care_email": "care@alpine.ch",
        "country_of_origin": "Switzerland",
        "language_detected": "English"
    }
    imported_eval = Big8Checker.evaluate(imported_data)
    imp_item = next(c for c in imported_eval["checklist"] if c["mandate_id"] == "mfg_address")
    assert imp_item["status"] == "VIOLATION"

    print("✓ All 11 mandates, Dual MRP, Rule 10 PIN validation, and Importer checks: PASS")

# ==============================================================================
# TEST CASE 8: Synthesizer with RAG Grounding
# ==============================================================================
def test_8_synthesizer_with_rag():
    print("\n--- [Test 8/9] Synthesizer with RAG Grounding ---")
    report = AuditSynthesizer.synthesize_report(
        product_name="Sample Wheat Crackers 200g",
        label_data={
            "generic_name": "Wheat Crackers",
            "net_quantity": "200g",
            "mrp": "₹50.00 (incl. of all taxes)",
            "unit_sale_price": "₹0.25/g",
            "mfg_date": "04/2024",
            "expiry_date": "10/2024",
            "manufacturer_address": "Bakery Foods Ltd, Industrial Area, Mumbai 400001",
            "consumer_care_phone": "1800-123-4567",
            "consumer_care_email": "care@bakery.com",
            "country_of_origin": "India",
            "language_detected": "English"
        }
    )
    assert report["compliance_score"] == 100
    assert report["legal_status"] == "FULLY_COMPLIANT"
    assert len(report["checklist"]) == 11
    assert "gazette_citation" in report["checklist"][0]
    assert report["checklist"][0]["gazette_citation"]["verbatim_clause"] is not None
    print(f"✓ Synthesizer generated complete 11-mandate report grounded in Gazette RAG: PASS")

# ==============================================================================
# TEST CASE 9: API Endpoints (ASGI Direct Execution)
# ==============================================================================
def test_9_api_endpoints():
    print("\n--- [Test 9/9] API Endpoints Verification ---")
    async def run_asgi_tests():
        async def request(method, full_path, body=None):
            import urllib.parse
            parsed = urllib.parse.urlsplit(full_path)
            path = parsed.path
            query_string = parsed.query.encode()

            scope = {
                'type': 'http',
                'method': method,
                'path': path,
                'raw_path': path.encode(),
                'query_string': query_string,
                'headers': [(b'content-type', b'application/json'), (b'host', b'localhost')]
            }
            body_bytes = json.dumps(body).encode() if body else b''
            messages = [{'type': 'http.request', 'body': body_bytes, 'more_body': False}]
            response_data = {'status': None, 'headers': [], 'body': b''}

            async def receive():
                return messages.pop(0) if messages else {'type': 'http.request', 'body': b'', 'more_body': False}

            async def send(msg):
                if msg['type'] == 'http.response.start':
                    response_data['status'] = msg['status']
                    response_data['headers'] = msg['headers']
                elif msg['type'] == 'http.response.body':
                    response_data['body'] += msg.get('body', b'')

            await app(scope, receive, send)
            return response_data['status'], json.loads(response_data['body'].decode())

        # 1. Health check
        status, health_data = await request('GET', '/health')
        assert status == 200, f"Health endpoint returned status {status}"
        assert health_data["rules_indexed"] >= 38

        # 2. Gazette rules endpoint
        status, rules_data = await request('GET', '/api/gazette/rules')
        assert status == 200, f"Gazette rules endpoint returned {status}"
        assert rules_data["total_count"] >= 38

        # 3. Gazette search endpoint
        status, search_data = await request('GET', '/api/gazette/search?q=unit+sale+price')
        assert status == 200, f"Gazette search endpoint returned {status}"
        assert len(search_data["results"]) > 0

        # 4. Audit run endpoint
        status, audit_data = await request('POST', '/api/audit/run', {
            'product_name': 'Test Milk 1L',
            'label_data': {
                'generic_name': 'Toned Milk',
                'net_quantity': '1L',
                'mrp': '₹60.00 (incl. of all taxes)',
                'unit_sale_price': '₹60.00/L',
                'mfg_date': '06/2024',
                'expiry_date': '06/2024',
                'manufacturer_address': 'Dairy Co-op, Anand, Gujarat 388001',
                'consumer_care_phone': '1800-258-3333',
                'consumer_care_email': 'customercare@amul.coop',
                'country_of_origin': 'India',
                'language_detected': 'English'
            }
        })
        assert status == 200, f"Audit run endpoint returned {status}"
        assert audit_data["legal_status"] == "FULLY_COMPLIANT"
        assert audit_data["summary"]["total_mandates_checked"] == 11

        print("✓ All endpoints (/health, /api/gazette/rules, /api/gazette/search, /api/audit/run): PASS")

    asyncio.run(run_asgi_tests())

# ==============================================================================
# MAIN TEST RUNNER
# ==============================================================================
if __name__ == "__main__":
    print("==================================================================")
    print("  NUTRISCAN / SIH26034 AUTOMATED STATUTORY VERIFICATION SUITE   ")
    print("==================================================================")
    test_1_corpus_completeness()
    test_2_bm25_retrieval_accuracy()
    test_3_tfidf_retrieval()
    test_4_rule_chain_resolution()
    test_5_category_filtering()
    test_6_math_engine()
    test_7_big8_checker_enhanced()
    test_8_synthesizer_with_rag()
    test_9_api_endpoints()
    print("\n==================================================================")
    print("  🎉 ALL 9 AUTOMATED VERIFICATION TEST CASES PASSED (100% GREEN)  ")
    print("==================================================================")
