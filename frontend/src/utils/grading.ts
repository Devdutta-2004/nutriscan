import { AuditReport, ChecklistItem } from '../types/compliance';

export type ProductGrade = 'A+' | 'A' | 'B' | 'C' | 'F';

export interface GradeDetails {
  grade: ProductGrade;
  title: string;
  subtitle: string;
  description: string;
  lawfulForSale: boolean;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  penaltyEstimate: string;
  actionRequired: string;
}

export interface DomainScore {
  id: string;
  name: string;
  score: number; // 0 - 100
  compliantCount: number;
  totalCount: number;
  status: 'OPTIMAL' | 'ADVISORY' | 'CRITICAL';
  color: string;
  description: string;
}

/**
 * Calculates official Legal Metrology compliance grade (A+ to F).
 */
export function calculateProductGrade(report: AuditReport): GradeDetails {
  const violations = report.summary.violations_count;
  const warnings = report.summary.warnings_count;
  const score = report.compliance_score;

  // Has critical math mismatch in USP
  const hasUspViolation = report.violations?.some((v) => v.mandate_id === 'usp');
  const hasDualMrp = report.violations?.some((v) => v.mandate_id === 'dual_mrp');

  if (violations === 0 && warnings === 0 && score >= 95) {
    return {
      grade: 'A+',
      title: 'Exemplary Compliance',
      subtitle: 'Zero Defects · 100% Lawful',
      description: 'Fully satisfies all statutory mandates under the Legal Metrology (Packaged Commodities) Rules, 2011.',
      lawfulForSale: true,
      color: '#10b981',
      bgColor: 'bg-emerald-50 text-emerald-950',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-300',
      badgeBg: 'bg-[#D5FF3F] text-zinc-950 border border-emerald-400',
      penaltyEstimate: '₹0 · No Statutory Liability',
      actionRequired: 'No action needed. Retain this certificate for legal metrology inspection records.',
    };
  }

  if (violations === 0 && score >= 85) {
    return {
      grade: 'A',
      title: 'Fully Compliant',
      subtitle: 'Minor Format Advisories',
      description: 'Lawful for retail distribution across Indian territory. Contains minor non-statutory advisories.',
      lawfulForSale: true,
      color: '#059669',
      bgColor: 'bg-emerald-50/80 text-emerald-900',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      penaltyEstimate: '₹0 · Non-Penal Formatting',
      actionRequired: 'Update label artwork on the next packaging print cycle.',
    };
  }

  if (violations === 0 || (violations === 1 && !hasUspViolation && !hasDualMrp && score >= 70)) {
    return {
      grade: 'B',
      title: 'Conditional / Advisory',
      subtitle: 'Statutory Rectification Needed',
      description: 'Sale is permissible, but an Advisory Notice is warranted under Rule 32 for missing secondary declarations.',
      lawfulForSale: true,
      color: '#f59e0b',
      bgColor: 'bg-amber-50 text-amber-950',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-300',
      badgeBg: 'bg-[#FBBF24] text-zinc-950 border border-amber-400',
      penaltyEstimate: 'Notice of Advisory · Compoundable',
      actionRequired: 'Remedy flagged items within 30 days of retail distribution.',
    };
  }

  if (violations <= 2 && score >= 50) {
    return {
      grade: 'C',
      title: 'Non-Compliant (High Risk)',
      subtitle: 'Improvement Notice Warranted',
      description: 'Violates core declarations under Rule 6(1). Liable for administrative Improvement Notice under Section 36(1).',
      lawfulForSale: false,
      color: '#f97316',
      bgColor: 'bg-orange-50 text-orange-950',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-300',
      badgeBg: 'bg-orange-500 text-white border border-orange-600',
      penaltyEstimate: 'Up to ₹25,000 (1st Offense under Rule 32)',
      actionRequired: 'Halt distribution until label declarations are corrected and aligned with Gazette rules.',
    };
  }

  return {
    grade: 'F',
    title: 'Severe Violation',
    subtitle: 'Unlawful for Retail Distribution',
    description: 'Substantial statutory non-compliance. Subject to immediate seizure under Section 15 and penalties under Rule 32 / Section 36.',
    lawfulForSale: false,
    color: '#e11d48',
    bgColor: 'bg-rose-50 text-rose-950',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-300',
    badgeBg: 'bg-[#FF2A85] text-white border border-rose-600 shadow-md',
    penaltyEstimate: '₹25,000 - ₹50,000 / Seizure under Sec 15',
    actionRequired: 'Immediate product quarantine. Legal counsel recommended prior to responding to notice.',
  };
}

/**
 * Calculates domain scores across 4 key legal metrology areas.
 */
export function calculateDomainScores(checklist: ChecklistItem[]): DomainScore[] {
  const domains = [
    {
      id: 'pricing',
      name: 'Pricing & USP Integrity',
      mandateIds: ['mrp', 'usp', 'dual_mrp'],
      color: '#8B5CF6',
      description: 'Maximum Retail Price, mandatory tax inclusion, and Unit Sale Price mathematical verification.',
    },
    {
      id: 'identity',
      name: 'Identity & Traceability',
      mandateIds: ['generic_name', 'mfg_address', 'country_of_origin'],
      color: '#3B82F6',
      description: 'Generic product title, manufacturer postal address with 6-digit PIN code, and origin declarations.',
    },
    {
      id: 'quantity',
      name: 'Quantity & Metric Standards',
      mandateIds: ['net_quantity'],
      color: '#10B981',
      description: 'Net quantity in standard metric units (g/kg/ml/L) free from deceptive qualifying terms.',
    },
    {
      id: 'consumer_protection',
      name: 'Consumer Rights & Dates',
      mandateIds: ['consumer_care', 'mfg_date', 'best_before', 'language'],
      color: '#F59E0B',
      description: 'Dual-channel consumer helpline (phone + email), date of manufacture, shelf-life, and language.',
    },
  ];

  return domains.map((d) => {
    const items = checklist.filter((c) => d.mandateIds.includes(c.mandate_id));
    const totalCount = items.length || 1;
    let compliantCount = 0;

    items.forEach((item) => {
      if (item.status === 'COMPLIANT') {
        compliantCount += 1;
      } else if (item.status === 'WARNING') {
        compliantCount += 0.5;
      }
    });

    const score = Math.round((compliantCount / totalCount) * 100);
    const status: 'OPTIMAL' | 'ADVISORY' | 'CRITICAL' =
      score >= 85 ? 'OPTIMAL' : score >= 60 ? 'ADVISORY' : 'CRITICAL';

    return {
      id: d.id,
      name: d.name,
      score,
      compliantCount: Math.round(compliantCount),
      totalCount: items.length,
      status,
      color: d.color,
      description: d.description,
    };
  });
}

/**
 * Translates dense legal text into a concise, human-readable 1-sentence finding.
 */
export function getPlainEnglishSummary(item: ChecklistItem): string {
  switch (item.mandate_id) {
    case 'generic_name':
      return item.status === 'COMPLIANT'
        ? `Common/generic name identified clearly as "${item.extracted_text}".`
        : 'The generic or common identity of the commodity is missing on the packaging.';

    case 'net_quantity':
      return item.status === 'COMPLIANT'
        ? `Net quantity declared in legal SI metric units (${item.extracted_text}).`
        : 'Net quantity missing or expressed with unauthorized qualifiers like "approx".';

    case 'mrp':
      return item.status === 'COMPLIANT'
        ? `Retail price is clearly marked inclusive of all taxes (${item.extracted_text}).`
        : item.status === 'WARNING'
        ? 'MRP is declared, but the mandatory words "inclusive of all taxes" are omitted.'
        : 'Maximum Retail Price declaration is completely absent.';

    case 'usp':
      return item.status === 'COMPLIANT'
        ? `Unit Sale Price (${item.extracted_text}) exactly matches the statutory math formula.`
        : item.status === 'WARNING'
        ? 'Unit Sale Price is present but has non-standard formatting.'
        : 'Unit Sale Price (USP) is missing or mathematically inconsistent with MRP and Net Quantity.';

    case 'mfg_date':
      return item.status === 'COMPLIANT'
        ? `Packaging date is unambiguously declared (${item.extracted_text}).`
        : 'Month and year of manufacture or packaging is missing or incomplete.';

    case 'mfg_address':
      return item.status === 'COMPLIANT'
        ? 'Complete postal address of the manufacturer with PIN code is verified.'
        : item.status === 'WARNING'
        ? 'Manufacturer address is printed, but the 6-digit postal PIN code is missing.'
        : 'Name and postal address of manufacturer or registered Indian importer is missing.';

    case 'consumer_care':
      return item.status === 'COMPLIANT'
        ? 'Both a customer phone helpline and email address are provided for grievance redressal.'
        : item.status === 'WARNING'
        ? 'Consumer care is incomplete (either phone number or email address is missing).'
        : 'No consumer care contact details (neither telephone nor email) are provided.';

    case 'country_of_origin':
      return item.status === 'COMPLIANT'
        ? `Country of origin explicitly marked as "${item.extracted_text}".`
        : 'Country of origin is not explicitly declared on the label.';

    case 'best_before':
      return item.status === 'COMPLIANT'
        ? `Best before / shelf life date declared (${item.extracted_text}).`
        : 'Perishable commodity missing mandatory "Best Before" or "Use By" date.';

    case 'language':
      return item.status === 'COMPLIANT'
        ? 'Declarations are in Hindi (Devanagari) or English as mandated by Rule 9(4).'
        : 'Mandatory declarations must be in Hindi or English.';

    case 'dual_mrp':
      return item.status === 'COMPLIANT'
        ? 'Single, uniform Maximum Retail Price verified (no dual pricing).'
        : 'Multiple conflicting MRP values detected on the same package (Dual MRP violation).';

    default:
      return item.reason;
  }
}
