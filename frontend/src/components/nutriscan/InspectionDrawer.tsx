import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Scale, Calculator, Terminal } from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { CanvasViewer } from '../inspection/CanvasViewer';
import { UspFormulaCard } from '../audit/UspFormulaCard';
import { Big8Checklist } from '../audit/Big8Checklist';
import { GazetteDrawer } from '../audit/GazetteDrawer';
import { OCRRawTextViewer } from './OCRRawTextViewer';

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
  const [viewTab, setViewTab] = useState<'label' | 'checklist' | 'math' | 'gazette' | 'ocr'>('label');

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
              <h3 className="font-extrabold text-base text-zinc-900 leading-tight truncate max-w-[260px] sm:max-w-[320px]">
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
        <div className="flex items-center gap-1.5 p-2 bg-white/60 border-b border-zinc-200/60 overflow-x-auto text-xs font-bold no-scrollbar">
          <button
            onClick={() => setViewTab('label')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              viewTab === 'label'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Label Canvas
          </button>
          <button
            onClick={() => setViewTab('checklist')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              viewTab === 'checklist'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Big-8 Rules ({report.summary.compliant_count}/8)
          </button>
          <button
            onClick={() => setViewTab('math')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              viewTab === 'math'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            USP Math
          </button>
          <button
            onClick={() => setViewTab('ocr')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              viewTab === 'ocr'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Raw OCR
          </button>
          <button
            onClick={() => setViewTab('gazette')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              viewTab === 'gazette'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Gazette Law
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

          {viewTab === 'ocr' && (
            <div>
              <OCRRawTextViewer
                rawText={report.raw_ocr_text}
                extractedFields={report.label_data}
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

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-white border-t border-zinc-200/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            Close
          </button>

          <button
            onClick={onOpenNotice}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              isCompliant
                ? 'bg-[#D5FF3F] text-zinc-950 hover:bg-[#c9f635]'
                : 'bg-[#FF2A85] text-white hover:bg-rose-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {isCompliant ? 'View Statutory Certificate' : 'Issue Rule 32 Notice'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
