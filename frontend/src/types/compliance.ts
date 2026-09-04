export type ComplianceStatus = 'COMPLIANT' | 'WARNING' | 'VIOLATION';

export interface BoundingBox {
  id: string;
  mandate_id: string;
  label: string;
  text: string;
  status: ComplianceStatus;
  bbox: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  color: string;
}

export interface GazetteCitation {
  rule: string;
  gazette_ref: string;
  verbatim_clause?: string;
  verbatim_text?: string;
  officer_guidance: string;
  penalty_rule: string;
}

export interface USPVerification {
  status: ComplianceStatus;
  is_valid: boolean;
  reason: string;
  statutory_rule: string;
  violation_code?: string;
  discrepancy?: string;
  printed?: string | null;
  calculated?: {
    expected_usp_value: number;
    expected_usp_unit: string;
    expected_display: string;
    alt_usp_value?: number | null;
    alt_usp_unit?: string | null;
    alt_display?: string | null;
    formula: string;
  };
}

export interface ChecklistItem {
  mandate_id: string;
  name: string;
  rule: string;
  status: ComplianceStatus;
  extracted_text: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  citation_key?: string;
  gazette_citation?: any;
  details?: any;
}

export interface AuditReport {
  audit_id: string;
  audit_timestamp: string;
  product_name: string;
  legal_status: string;
  status_text?: string;
  compliance_score: number;
  corpus_version?: string;
  summary: {
    total_mandates_checked: number;
    compliant_count: number;
    warnings_count: number;
    violations_count: number;
    is_lawful_for_sale?: boolean;
  };
  checklist: ChecklistItem[];
  usp_verification: USPVerification;
  violations: ChecklistItem[];
  warnings: ChecklistItem[];
  bounding_boxes: BoundingBox[];
  image_url?: string;
  preset_id?: string;
  label_data?: any;
  is_live_upload?: boolean;
  raw_ocr_text?: string;
}

export interface DemoPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  compliance_target: string;
  expected_score: number;
  label_data: {
    generic_name: string;
    net_quantity: string;
    mrp: string;
    unit_sale_price: string;
    mfg_date: string;
    manufacturer_address: string;
    importer_address?: string;
    consumer_care_phone: string;
    consumer_care_email: string;
    country_of_origin: string;
  };
  bounding_boxes: BoundingBox[];
}
