import React, { useState } from 'react';
import { 
  X, FileText, CheckCircle2, AlertTriangle, XCircle, 
  BarChart3, LayoutDashboard, CheckSquare, Image as ImageIcon, 
  BookOpen, Award, ShieldAlert, ShieldCheck, Printer, ArrowUpRight 
} from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { CanvasViewer } from '../inspection/CanvasViewer';
import { Big8Checklist } from '../audit/Big8Checklist';
import { GazetteDrawer } from '../audit/GazetteDrawer';
import { ComplianceCharts } from '../audit/ComplianceCharts';
import { OCRRawTextViewer } from './OCRRawTextViewer';
import { calculateProductGrade } from '../../utils/grading';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'checklist' | 'label' | 'notice'>('overview');
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);

  if (!isOpen || !report) return null;

  const gradeInfo = calculateProductGrade(report);
  const isCompliant = report.summary.violations_count === 0;

  const handleSelectMandate = (mandateId: string) => {
    setSelectedMandateId(mandateId);
    const match = report.bounding_boxes?.find((b) => b.mandate_id === mandateId);
    if (match) {
      setActiveBoxId(match.id);
      setActiveTab('label');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-4xl bg-[#F7F5EC] border border-zinc-300 rounded-t-[36px] sm:rounded-[36px] shadow-2xl max-h-[94vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-zinc-200/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Grade Seal Badge */}
            <div
              className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm shrink-0 ${gradeInfo.badgeBg}`}
            >
              <span className="text-lg leading-none">{gradeInfo.grade}</span>
              <span className="text-[8px] tracking-wider uppercase font-bold opacity-80">GRADE</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-zinc-900 truncate">
                  {report.product_name}
                </h3>
                <span
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${
                    gradeInfo.lawfulForSale
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {gradeInfo.lawfulForSale ? 'Lawful for Sale' : 'Statutory Violation'}
                </span>
              </div>

              <p className="text-xs font-semibold text-zinc-500 mt-0.5 truncate">
                LMPC Compliance Index: <strong className="text-zinc-900">{report.compliance_score}%</strong> ·{' '}
                {report.summary.violations_count === 0 ? (
                  <span className="text-emerald-600 font-bold">Verified Compliant</span>
                ) : (
                  <span className="text-[#FF2A85] font-bold">
                    {report.summary.violations_count} Defects Flagged
                  </span>
                )}
                {' · '}
                <span className="text-zinc-400 font-mono text-[11px]">{report.audit_id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors"
              title="Close Inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/70 border-b border-zinc-200/80 overflow-x-auto text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview &amp; Grade</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Charts &amp; USP</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'checklist'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>11 Mandates ({report.summary.compliant_count}/{report.summary.total_mandates_checked || 11})</span>
          </button>

          <button
            onClick={() => setActiveTab('label')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'label'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Label Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('notice')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'notice'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gazette Law &amp; Notice</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW & GRADE */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Executive Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Statutory Grade
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-zinc-900">{gradeInfo.grade}</span>
                    <span className="text-[11px] font-bold text-zinc-500 leading-tight">
                      {gradeInfo.title}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Retail Sale Status
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {gradeInfo.lawfulForSale ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-black truncate ${
                        gradeInfo.lawfulForSale ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {gradeInfo.lawfulForSale ? 'Lawful to Sell' : 'Distribution Barred'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Mandates Passed
                  </span>
                  <p className="text-2xl font-black text-zinc-900 mt-1 font-mono">
                    {report.summary.compliant_count}
                    <span className="text-xs text-zinc-400 font-bold ml-1">
                      /{report.summary.total_mandates_checked || 11}
                    </span>
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Statutory Penalty Risk
                  </span>
                  <p className="text-xs font-black text-zinc-900 mt-1.5 font-mono truncate" title={gradeInfo.penaltyEstimate}>
                    {gradeInfo.penaltyEstimate}
                  </p>
                </div>
              </div>

              {/* Compliance Charts (Pie + Assessment) */}
              <ComplianceCharts report={report} onSelectMandate={handleSelectMandate} />

              {/* Actionable Findings Overview */}
              <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Priority Inspection Findings
                  </h4>
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <span>View all 11 mandates</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {report.violations.length === 0 && report.warnings.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="font-extrabold text-sm">100% Statutory Adherence Verified</h5>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        This packaging specimen satisfies all mandatory declarations under Chapter II of the Legal Metrology (Packaged Commodities) Rules, 2011.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Violations First */}
                    {report.violations.map((v) => (
                      <div
                        key={v.mandate_id}
                        onClick={() => handleSelectMandate(v.mandate_id)}
                        className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200 hover:bg-rose-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-extrabold text-xs text-rose-950 mr-2">{v.name}:</span>
                            <span className="text-xs text-rose-800 font-medium">{v.reason}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 shrink-0">
                          {v.rule}
                        </span>
                      </div>
                    ))}

                    {/* Warnings */}
                    {report.warnings.map((w) => (
                      <div
                        key={w.mandate_id}
                        onClick={() => handleSelectMandate(w.mandate_id)}
                        className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 hover:bg-amber-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-extrabold text-xs text-amber-950 mr-2">{w.name}:</span>
                            <span className="text-xs text-amber-800 font-medium">{w.reason}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 shrink-0">
                          {w.rule}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL CHARTS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <ComplianceCharts report={report} onSelectMandate={handleSelectMandate} />

              {/* Raw OCR preview toggle */}
              <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Extracted Raw Optical Text (OCR Layer)
                </h4>
                <OCRRawTextViewer
                  rawText={report.raw_ocr_text}
                  extractedFields={report.label_data}
                />
              </div>
            </div>
          )}

          {/* TAB 3: 11-MANDATE CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm">
              <Big8Checklist
                checklist={report.checklist}
                selectedMandateId={selectedMandateId}
                onSelectMandate={handleSelectMandate}
              />
            </div>
          )}

          {/* TAB 4: LABEL CANVAS */}
          {activeTab === 'label' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                      Interactive Label Spatial Canvas
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Click any bounding box or mandate to spotlight its location on the packaging
                    </p>
                  </div>
                  {selectedMandateId && (
                    <button
                      onClick={() => setSelectedMandateId(null)}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-800"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* Multi-Panel Image Switcher */}
                {report.additional_image_urls && report.additional_image_urls.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-zinc-100 overflow-x-auto">
                    <span className="text-[11px] font-bold text-zinc-400 shrink-0">
                      Panels ({1 + report.additional_image_urls.length}):
                    </span>
                    {[report.image_url || '/presets/compliant_biscuit.svg', ...report.additional_image_urls].map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPanelIndex(idx)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          selectedPanelIndex === idx
                            ? 'bg-[#0E1118] text-[#D5FF3F] shadow-sm'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {idx === 0 ? 'Panel 1 (Front)' : idx === 1 ? 'Panel 2 (Back)' : `Panel ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <CanvasViewer
                  imageUrl={
                    [report.image_url || '/presets/compliant_biscuit.svg', ...(report.additional_image_urls || [])][
                      selectedPanelIndex
                    ] || report.image_url || '/presets/compliant_biscuit.svg'
                  }
                  boundingBoxes={report.bounding_boxes}
                  activeBoxId={activeBoxId}
                  onSelectBox={setActiveBoxId}
                  selectedMandateId={selectedMandateId}
                />
              </div>
            </div>
          )}

          {/* TAB 5: LEGAL GAZETTE & NOTICE */}
          {activeTab === 'notice' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                      Statutory Gazette Legal Citations
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Official legal text and enforcement powers under Legal Metrology Act, 2009
                    </p>
                  </div>
                </div>

                <GazetteDrawer
                  selectedItem={
                    report.checklist?.find((i) => i.mandate_id === selectedMandateId) ||
                    report.violations[0] ||
                    report.checklist[0]
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-zinc-200/90 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotice}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                isCompliant
                  ? 'bg-[#D5FF3F] text-zinc-950 hover:bg-[#c9f635]'
                  : 'bg-[#FF2A85] text-white hover:bg-rose-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>
                {isCompliant ? 'View Statutory Compliance Certificate' : 'Issue Rule 32 / Section 36 Notice'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
