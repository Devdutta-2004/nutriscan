import React from 'react';
import { AuditReport } from '../../types/compliance';
import { ComplianceGauge } from './ComplianceGauge';
import { UspFormulaCard } from './UspFormulaCard';
import { Big8Checklist } from './Big8Checklist';
import { GazetteDrawer } from './GazetteDrawer';

interface AuditBentoGridProps {
  report: AuditReport;
  selectedMandateId: string | null;
  onSelectMandate: (mandateId: string) => void;
}

export const AuditBentoGrid: React.FC<AuditBentoGridProps> = ({
  report,
  selectedMandateId,
  onSelectMandate,
}) => {
  const selectedItem =
    report.checklist.find((item) => item.mandate_id === selectedMandateId) ||
    report.violations[0] ||
    report.checklist[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Tile 1: Compliance Gauge Dial */}
      <ComplianceGauge
        score={report.compliance_score}
        violationsCount={report.summary.violations_count}
        warningsCount={report.summary.warnings_count}
        legalStatus={report.legal_status}
      />

      {/* Tile 2: Deterministic USP Formula Verification Block */}
      <UspFormulaCard
        usp={report.usp_verification}
        onHighlightMandate={() => onSelectMandate('usp')}
      />

      {/* Tile 3: Big-8 Mandatory Checklist Accordion */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-md">
        <Big8Checklist
          checklist={report.checklist}
          selectedMandateId={selectedMandateId}
          onSelectMandate={onSelectMandate}
        />
      </div>

      {/* Tile 4: Statutory Gazette Accordion Drawer */}
      <GazetteDrawer selectedItem={selectedItem} />
    </div>
  );
};
