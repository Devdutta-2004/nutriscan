"""
Test suite for NutriScan Complaint Portal, State Routing, and INGRAM Integration.
"""

import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.api.complaints import (
    STATE_DEPT_MAP,
    submit_complaint,
    track_complaint,
    get_all_complaints,
    update_complaint_status,
    forward_to_ingram,
    ComplaintSubmission,
    ComplaintStatusUpdate,
    GOV_OFFICER_TOKEN,
)


def test_1_state_routing_completeness():
    print("\n--- [Complaint Test 1/5] State Routing Completeness ---")
    assert len(STATE_DEPT_MAP) >= 28, f"Expected at least 28 states/UTs mapped, got {len(STATE_DEPT_MAP)}"
    for state, info in STATE_DEPT_MAP.items():
        assert "dept" in info and info["dept"], f"Missing dept for {state}"
        assert "email" in info and info["email"], f"Missing email for {state}"
        assert "phone" in info and info["phone"], f"Missing phone for {state}"
    print(f"[OK] All {len(STATE_DEPT_MAP)} States & UTs mapped to Legal Metrology Depts: PASS")


def test_2_submit_complaint():
    print("\n--- [Complaint Test 2/5] Submit Complaint & Auto-Routing ---")
    submission = ComplaintSubmission(
        product_name="Dark Chocolate Bar 100g",
        brand_name="ChocoLux",
        barcode_value="8901234567890",
        purchase_location="Supermarket Sector 18, Noida",
        purchase_date="2026-09-01",
        audit_id="AUD-TEST-001",
        violations=["usp", "mrp"],
        violation_rules=["Rule 6(1)(s)", "Rule 6(1)(d)"],
        description="The package has no Unit Sale Price (USP) declared, and the MRP is crossed out with a higher sticker price.",
        consumer_name="Rahul Sharma",
        consumer_email="rahul@example.com",
        consumer_phone="9876543210",
        consumer_state="Uttar Pradesh",
        consumer_district="Gautam Buddha Nagar"
    )

    res = asyncio.run(submit_complaint(submission))
    assert res["success"] is True
    assert res["ref_number"].startswith("NSC-")
    assert res["status"] == "Submitted"
    assert "UP Legal Metrology Dept" in res["routed_to"]["department"]
    print(f"[OK] Complaint submitted with Ref [{res['ref_number']}] -> Routed to [{res['routed_to']['department']}]: PASS")
    return res["ref_number"]


def test_3_track_complaint(ref_number: str):
    print("\n--- [Complaint Test 3/5] Track Complaint by Reference Number ---")
    res = asyncio.run(track_complaint(ref_number))
    assert res["ref_number"] == ref_number
    assert res["status"] == "Submitted"
    assert res["product_name"] == "Dark Chocolate Bar 100g"
    assert res["consumer_state"] == "Uttar Pradesh"
    assert len(res["timeline"]) >= 2
    print(f"[OK] Complaint tracking verified for [{ref_number}], Status: {res['status']}: PASS")


def test_4_officer_dashboard_and_update(ref_number: str):
    print("\n--- [Complaint Test 4/5] Gov Officer Dashboard & Status Update ---")
    all_res = asyncio.run(get_all_complaints(state=None, status=None, _=True))
    assert all_res["total"] >= 1
    found = next((c for c in all_res["complaints"] if c["ref_number"] == ref_number), None)
    assert found is not None, f"Complaint {ref_number} not found in dashboard"

    # Update status to 'Under Review'
    update = ComplaintStatusUpdate(
        status="Under Review",
        officer_notes="Assigned to District Metrology Inspector Noida.",
        action_taken="Inspection notice issued to vendor."
    )
    update_res = asyncio.run(update_complaint_status(complaint_id=ref_number, body=update, _=True))
    assert update_res["success"] is True
    assert update_res["new_status"] == "Under Review"

    # Verify updated status
    tracked = asyncio.run(track_complaint(ref_number))
    assert tracked["status"] == "Under Review"
    assert tracked["officer_notes"] == "Assigned to District Metrology Inspector Noida."
    print(f"[OK] Status updated to [{tracked['status']}] with officer notes: PASS")


def test_5_ingram_forwarding(ref_number: str):
    print("\n--- [Complaint Test 5/5] INGRAM National Consumer Helpline Forwarding ---")
    fwd_res = asyncio.run(forward_to_ingram(complaint_id=ref_number, _=True))
    assert fwd_res["success"] is True
    assert fwd_res["forwarded"] is True
    assert "consumerhelpline.gov.in" in fwd_res["portal_url"]
    assert "ingram_prefill_url" in fwd_res

    # Track to verify forwarded state
    tracked = asyncio.run(track_complaint(ref_number))
    assert tracked["status"] == "Forwarded"
    assert tracked["ingram_forwarded"] is True
    print(f"[OK] Forwarded to INGRAM ({fwd_res['portal']}): PASS")


if __name__ == "__main__":
    print("=" * 60)
    print("FairPack Complaint & Grievance Redressal Integration Tests")
    print("=" * 60)
    test_1_state_routing_completeness()
    ref = test_2_submit_complaint()
    test_3_track_complaint(ref)
    test_4_officer_dashboard_and_update(ref)
    test_5_ingram_forwarding(ref)
    print("\n" + "=" * 60)
    print("ALL 5 COMPLAINT & INGRAM TESTS PASSED!")
    print("=" * 60)
