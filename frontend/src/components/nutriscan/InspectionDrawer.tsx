import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Scale, Calculator } from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { CanvasViewer } from '../inspection/CanvasViewer';
import { UspFormulaCard } from '../audit/UspFormulaCard';
import { Big8Checklist } from '../audit/Big8Checklist';
import { GazetteDrawer } from '../audit/GazetteDrawer';

interface InspectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport | null;
  onOpenNotice: () => void;
}

export const InspectionDrawer: React.FC<InspectionDrawerProps> = ({
  isOpen,
  onClose,
  report,
  onOpenNotice,
}) => {
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [selectedMandateId, setSelectedMandateId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'label' | 'checklist' | 'math' | 'gazette'>('label');

  if (!isOpen || !report) return null;

  const isCompliant = report.summary.violations_count === 0;

  const handleSelectMandate = (mandateId: string) => {
    setSelectedMandateId(mandateId);
    const match = report.bounding_boxes.find((b) => b.mandate_id === mandateId);
    if (match) {
      setActiveBoxId(match.id);
      setViewTab('label');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-[540px] bg-[#F7F5EC] border border-zinc-300 rounded-t-[32px] sm:rounded-[32px] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                report.compliance_score >= 90
                  ? 'bg-[#D5FF3F] text-zinc-950'
                  : report.compliance_score >= 70
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-[#FF2A85] text-white'
              }`}
            >
              {report.compliance_score >= 90 ? 'A+' : report.compliance_score >= 70 ? 'B-' : 'C'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 leading-tight">
                {report.product_name}
              </h3>
              <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">
                Compliance Index: <strong className="text-zinc-900">{report.compliance_score}%</strong> ·{' '}
                {report.summary.violations_count === 0 ? (
                  <span className="text-emerald-600 font-bold">100% Lawful</span>
                ) : (
                  <span className="text-[#FF2A85] font-bold">
                    {report.summary.violations_count} Non-Compliances
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-2 bg-white/60 border-b border-zinc-200/60 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setViewTab('label')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewTab === 'label'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Label Canvas
          </button>
          <button
            onClick={() => setViewTab('checklist')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewTab === 'checklist'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Big-8 Rules ({report.summary.compliant_count}/8)
          </button>
          <button
            onClick={() => setViewTab('math')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewTab === 'math'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            USP Formula
          </button>
          <button
            onClick={() => setViewTab('gazette')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewTab === 'gazette'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Gazette Citation
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {viewTab === 'label' && (
            <div>
              <CanvasViewer
                imageUrl={report.image_url || '/presets/compliant_biscuit.svg'}
                boundingBoxes={report.bounding_boxes}
                activeBoxId={activeBoxId}
                onSelectBox={setActiveBoxId}
                selectedMandateId={selectedMandateId}
              />
            </div>
          )}

          {viewTab === 'checklist' && (
            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm">
              <Big8Checklist
                checklist={report.checklist}
                selectedMandateId={selectedMandateId}
                onSelectMandate={handleSelectMandate}
              />
            </div>
          )}

          {viewTab === 'math' && (
            <div className="space-y-3">
              <UspFormulaCard
                usp={report.usp_verification}
                onHighlightMandate={() => handleSelectMandate('usp')}
              />
            </div>
          )}

          {viewTab === 'gazette' && (
            <div className="space-y-3">
              <GazetteDrawer
                selectedItem={
                  report.checklist.find((i) => i.mandate_id === selectedMandateId) ||
                  report.violations[0] ||
                  report.checklist[0]
                }
              />
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-white border-t border-zinc-200/80 flex items-center justify-between gap-3">
          <button
            onClick={onOpenNotice}
            className="flex-1 bg-[#0E1118] hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4 text-[#D5FF3F]" />
            <span>Generate Official Rule 32 Notice</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
