import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, CheckCircle2, AlertTriangle, XCircle, 
  BarChart3, Scale, ShieldCheck, ShieldAlert, Award, Calculator, 
  Printer, Image as ImageIcon, CheckSquare, BookOpen, RefreshCw,
  Eye, AlertOctagon, HelpCircle, ExternalLink, Sparkles, Barcode as BarcodeIcon,
  Shield, AlertCircle, ChevronDown, ChevronUp, Copy, Check, Flag
} from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { calculateProductGrade, calculateDomainScores, getPlainEnglishSummary } from '../../utils/grading';
import { CanvasViewer } from '../inspection/CanvasViewer';
import { OCRRawTextViewer } from './OCRRawTextViewer';
import { BarcodeSymbolsCard } from './BarcodeSymbolsCard';

interface FullPageReportProps {
  report: AuditReport | null;
  onClose: () => void;
  onOpenNotice: () => void;
  onOpenComplaint?: () => void;
  onRescan?: () => void;
}

const formatPenaltyText = (val: any): string => {
  if (!val) return 'Rule 32 (Fine up to ₹25,000)';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.id || 'Rule 32 (Fine up to ₹25,000)';
  return String(val);
};

export const FullPageReport: React.FC<FullPageReportProps> = ({
  report,
  onClose,
  onOpenNotice,
  onOpenComplaint,
  onRescan,
}) => {
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [selectedMandateId, setSelectedMandateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'barcodes' | 'canvas' | 'gazette'>('overview');
  const [filter, setFilter] = useState<'ALL' | 'VIOLATION' | 'WARNING' | 'COMPLIANT'>('ALL');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);

  if (!report) return null;

  const gradeInfo = calculateProductGrade(report);
  const domainScores = calculateDomainScores(report.checklist || []);

  const summary = report.summary || {
    total_mandates_checked: (report.checklist || []).length || 11,
    compliant_count: (report.checklist || []).filter((c) => c.status === 'COMPLIANT').length,
    warnings_count: (report.checklist || []).filter((c) => c.status === 'WARNING').length,
    violations_count: (report.checklist || []).filter((c) => c.status === 'VIOLATION').length,
  };

  const total = summary.total_mandates_checked || 11;
  const compliant = summary.compliant_count || 0;
  const warnings = summary.warnings_count || 0;
  const violations = summary.violations_count || 0;

  // Donut / Pie Chart calculations
  const radius = 58;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const compliantPercent = total > 0 ? (compliant / total) * 100 : 0;
  const warningPercent = total > 0 ? (warnings / total) * 100 : 0;
  const violationPercent = total > 0 ? (violations / total) * 100 : 0;

  const strokeCompliant = (compliantPercent / 100) * circumference;
  const strokeWarning = (warningPercent / 100) * circumference;
  const strokeViolation = (violationPercent / 100) * circumference;

  const offsetCompliant = 0;
  const offsetWarning = -strokeCompliant;
  const offsetViolation = -(strokeCompliant + strokeWarning);

  const usp = report.usp_verification;
  const isUspValid = usp?.status === 'COMPLIANT';

  const filteredItems = (report.checklist || []).filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const handleSpotlight = (mandateId: string) => {
    setSelectedMandateId(mandateId);
    const match = report.bounding_boxes?.find((b) => b.mandate_id === mandateId);
    if (match) {
      setActiveBoxId(match.id);
    }
    setActiveTab('canvas');
  };

  const isLawful = gradeInfo.lawfulForSale;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B0F17] text-slate-100 selection:bg-rose-500/30 selection:text-rose-200 flex flex-col font-sans antialiased">
      
      {/* Dynamic Ambient Mesh Glow Background */}
      <div 
        className="fixed inset-0 pointer-events-none -z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 10% 15%, rgba(244, 63, 94, 0.12) 0px, transparent 50%),
            radial-gradient(at 90% 10%, rgba(16, 185, 129, 0.10) 0px, transparent 45%),
            radial-gradient(at 50% 85%, rgba(245, 158, 11, 0.08) 0px, transparent 60%)
          `
        }}
      />

      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#161F30] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 flex items-center gap-2 font-medium text-xs transition-all active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Scanner</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold text-rose-400 tracking-wider">
                  STATUTORY AUDIT CONSOLE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse hidden sm:inline-block" />
              </div>
              <h1 className="text-base sm:text-lg font-black text-white truncate max-w-[240px] sm:max-w-md tracking-tight leading-none mt-0.5">
                {report.product_name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onRescan && (
              <button
                onClick={onRescan}
                className="hidden sm:flex px-3.5 py-2 rounded-xl bg-[#161F30] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 font-semibold text-xs items-center gap-1.5 transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Rescan</span>
              </button>
            )}

            <button
              onClick={onOpenNotice}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition-all active:scale-95 ${
                isLawful
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isLawful ? 'View Official Certificate' : 'Issue Rule 32 Legal Notice'}
              </span>
              <span className="sm:hidden">
                {isLawful ? 'Certificate' : 'Notice'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Page Scrollable Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 relative z-10">
        
        {/* 1. Hero Status Card (Matches Mockup's sleek high-contrast card) */}
        <section className="bg-[#111827]/95 rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          
          {/* Top Edge Gradient Stripe */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            isLawful 
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600'
          }`} />

          {/* Background Holographic Watermark */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none select-none">
            <Scale className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left Column: Grade Badge + Identity */}
            <div className="flex items-start sm:items-center gap-5">
              
              {/* Vibrant Grade Badge Square */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center font-black shadow-xl shrink-0 border border-white/10 ${
                  isLawful 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950'
                    : 'bg-gradient-to-br from-amber-500 via-rose-500 to-rose-700 text-white'
                }`}>
                  <span className="text-3xl sm:text-4xl leading-none tracking-tight">{gradeInfo.grade}</span>
                  <span className="text-[10px] sm:text-[11px] tracking-widest uppercase font-bold mt-1 opacity-90">
                    GRADE
                  </span>
                </div>
                <div className="mt-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                    isLawful 
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                  }`}>
                    {isLawful ? 'LOW RISK' : 'HIGH RISK'}
                  </span>
                </div>
              </div>

              {/* Identity & Legal Posture */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#161F30] border border-slate-700/80 text-slate-300 text-[11px] font-mono font-bold">
                    {report.audit_id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                    isLawful
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                  }`}>
                    {isLawful ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
                    <span>{isLawful ? 'LAWFUL FOR DISTRIBUTION' : 'STATUTORY CONTRAVENTION DETECTED'}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {report.product_name}
                </h2>

                <p className="text-sm font-medium text-slate-400 max-w-xl leading-relaxed">
                  {gradeInfo.description}
                </p>

                <div className="pt-2 flex items-center gap-3 sm:gap-4 text-xs font-medium text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-500">Audit:</span>
                    <strong className="text-slate-200 font-mono">
                      {report.audit_timestamp ? new Date(report.audit_timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                    </strong>
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-500">Corpus:</span>
                    <strong className="text-indigo-400 font-mono">
                      LMPC Gazette v{report.corpus_version || '2024.1'}
                    </strong>
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-500">Penalty Exposure:</span>
                    <strong className="text-rose-400 font-mono">
                      {gradeInfo.penaltyEstimate}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrology Metrics Tiles */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-[#161F30]/90 p-4 rounded-xl border border-slate-700/60 text-center min-w-[130px] shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Compliance Score
                </span>
                <p className="text-3xl font-black text-white mt-1 font-mono tracking-tight">
                  {report.compliance_score}%
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  {total} Mandates Audited
                </span>
              </div>

              <div className="bg-[#161F30]/90 p-4 rounded-xl border border-slate-700/60 text-center min-w-[130px] shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Defects Found
                </span>
                <p className={`text-3xl font-black mt-1 font-mono tracking-tight ${violations > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {violations}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  {violations === 0 ? 'Zero Violations' : `${violations} Non-Compliant`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Analytical Visual Graphs & Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Donut / Pie Chart Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#111827]/90 rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-xl flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                  Statutory Compliance Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proportionate compliance across mandatory Legal Metrology declarations
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#161F30] text-slate-300 border border-slate-700/60">
                {total} Mandates
              </span>
            </div>

            <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-8">
              
              {/* Interactive SVG Donut Ring */}
              <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90 transform drop-shadow-md" viewBox="0 0 160 160">
                  {/* Track ring */}
                  <circle cx="80" cy="80" r={radius} stroke="#1f293d" strokeWidth={strokeWidth} fill="none" />

                  {/* Compliant Arc */}
                  {compliant > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#10b981"
                      strokeWidth={hoveredSlice === 'compliant' ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${strokeCompliant} ${circumference}`}
                      strokeDashoffset={offsetCompliant}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice('compliant')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  )}

                  {/* Warnings Arc */}
                  {warnings > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#f59e0b"
                      strokeWidth={hoveredSlice === 'warnings' ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${strokeWarning} ${circumference}`}
                      strokeDashoffset={offsetWarning}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice('warnings')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  )}

                  {/* Violations Arc */}
                  {violations > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#f43f5e"
                      strokeWidth={hoveredSlice === 'violations' ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${strokeViolation} ${circumference}`}
                      strokeDashoffset={offsetViolation}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice('violations')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  )}
                </svg>

                {/* Center Seal */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-4xl font-black text-white tracking-tight leading-none">
                    {gradeInfo.grade}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 font-mono">
                    {report.compliance_score}%
                  </span>
                </div>
              </div>

              {/* Interactive Legend Cards */}
              <div className="space-y-3 w-full sm:w-64">
                <div
                  onMouseEnter={() => setHoveredSlice('compliant')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    hoveredSlice === 'compliant'
                      ? 'bg-emerald-950/50 border-emerald-500/80 scale-102'
                      : 'bg-[#161F30]/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs shadow-emerald-500/50" />
                    <div>
                      <p className="font-bold text-xs text-slate-200">Compliant (Pass)</p>
                      <p className="text-[10px] text-slate-400 font-medium">Satisfies statutory rules</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {compliant} <span className="text-[11px] text-slate-500 font-sans">({Math.round(compliantPercent)}%)</span>
                  </span>
                </div>

                <div
                  onMouseEnter={() => setHoveredSlice('warnings')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    hoveredSlice === 'warnings'
                      ? 'bg-amber-950/50 border-amber-500/80 scale-102'
                      : 'bg-[#161F30]/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs shadow-amber-500/50" />
                    <div>
                      <p className="font-bold text-xs text-slate-200">Format Advisories</p>
                      <p className="text-[10px] text-slate-400 font-medium">Non-penal corrections</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-amber-400">
                    {warnings} <span className="text-[11px] text-slate-500 font-sans">({Math.round(warningPercent)}%)</span>
                  </span>
                </div>

                <div
                  onMouseEnter={() => setHoveredSlice('violations')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    hoveredSlice === 'violations'
                      ? 'bg-rose-950/50 border-rose-500/80 scale-102'
                      : 'bg-[#161F30]/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-xs shadow-rose-500/50" />
                    <div>
                      <p className="font-bold text-xs text-slate-200">Critical Violations</p>
                      <p className="text-[10px] text-slate-400 font-medium">Rule 32 penalty liability</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-rose-400">
                    {violations} <span className="text-[11px] text-slate-500 font-sans">({Math.round(violationPercent)}%)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Authority: Dept. of Consumer Affairs, Legal Metrology Division</span>
              <span className="font-bold text-slate-300 font-mono">G.S.R. 784(E) 2024</span>
            </div>
          </div>

          {/* 4 Pillars Legal Category Graph (5 cols) */}
          <div className="lg:col-span-5 bg-[#111827]/90 rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                  4 Legal Domain Pillar Scores
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated metric weights across statutory pillars
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">Target: 100%</span>
            </div>

            <div className="space-y-3 py-1">
              {domainScores.map((domain) => (
                <div key={domain.id} className="space-y-1.5 bg-[#161F30]/70 p-3 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: domain.color }} />
                      <span className="font-bold text-slate-200">{domain.name}</span>
                    </div>
                    <span className="font-black font-mono text-white text-xs">
                      {domain.score}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${domain.score}%`, backgroundColor: domain.color }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium pt-0.5">
                    {domain.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-medium">
              Ground truth verified against LMPC 2011 Rules &amp; Decriminalization Amendments.
            </div>
          </div>
        </section>

        {/* 3. Mathematical USP Verification Visualizer */}
        {usp && (
          <section className="bg-[#111827]/90 rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-xl space-y-4 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300 flex items-center justify-center shadow-xs">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Unit Sale Price (USP) Mathematical Verification
                  </h3>
                  <p className="text-xs text-slate-400">
                    Statutory computation audit under Rule 6(1)(s) and Rule 6(11) (G.S.R. 779(E))
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-md text-xs font-black tracking-wide uppercase self-start sm:self-auto ${
                  isUspValid
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/60 animate-pulse'
                }`}
              >
                {isUspValid ? 'STATUTORILY ACCURATE' : 'USP STATUTORY MISMATCH / OMITTED'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#161F30]/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Printed on Label
                </span>
                <p className="text-xl font-black text-white font-mono">
                  {usp.printed || '[NOT DECLARED]'}
                </p>
                <p className="text-xs text-slate-400">Extracted from packaging OCR token scan</p>
              </div>

              <div className="bg-[#161F30]/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Mandated Calculated Rate
                </span>
                <p className="text-xl font-black text-emerald-400 font-mono">
                  {usp.calculated?.expected_display || 'N/A'}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Formula: {usp.calculated?.formula || 'MRP ÷ Net Quantity'}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-1 ${
                  isUspValid
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  Enforcement Finding
                </span>
                <p className="text-sm font-black leading-snug">
                  {isUspValid ? 'Mathematical Tolerance Satisfied' : 'Actionable Discrepancy'}
                </p>
                <p className="text-xs opacity-90 leading-relaxed">
                  {usp.discrepancy || usp.reason || 'Unit sale price satisfies legal metrology standard.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 4. Tab Navigation for Detailed Sections */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-[#161F30] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>11 Mandates Breakdown ({compliant}/{total})</span>
          </button>

          <button
            onClick={() => setActiveTab('barcodes')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'barcodes'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-[#161F30] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <BarcodeIcon className="w-3.5 h-3.5" />
            <span>Barcode, QR &amp; Symbols</span>
            {report.barcode_data?.detected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'canvas'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-[#161F30] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Packaging Spatial Canvas &amp; Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab('gazette')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'gazette'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-[#161F30] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Gazette Citations (38 Rules)</span>
          </button>
        </div>

        {/* TAB A: 11 Mandates Breakdown (Clause Inspection List with Filter Tabs) */}
        {activeTab === 'overview' && (
          <section className="bg-[#111827]/90 rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-xl space-y-5 backdrop-blur-sm">
            
            {/* Filter Pills Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Statutory Clause Inspection List
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any item to inspect its official Gazette clause, penalty exposure, or spotlight on packaging
                </p>
              </div>

              {/* Filter Tabs matching HTML mockup */}
              <div className="flex items-center gap-1.5 bg-[#161F30] p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto border border-slate-700/60">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'ALL' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({report.checklist?.length || 11})
                </button>
                {violations > 0 && (
                  <button
                    onClick={() => setFilter('VIOLATION')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'VIOLATION' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-400 hover:bg-rose-950/40'
                    }`}
                  >
                    Violations ({violations})
                  </button>
                )}
                {warnings > 0 && (
                  <button
                    onClick={() => setFilter('WARNING')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'WARNING' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-400 hover:bg-amber-950/40'
                    }`}
                  >
                    Advisories ({warnings})
                  </button>
                )}
                <button
                  onClick={() => setFilter('COMPLIANT')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'COMPLIANT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-400 hover:bg-emerald-950/40'
                  }`}
                >
                  Pass ({compliant})
                </button>
              </div>
            </div>

            {/* Mandate Cards List */}
            <div className="space-y-3.5">
              {filteredItems.map((item) => {
                const isViolation = item.status === 'VIOLATION';
                const isWarning = item.status === 'WARNING';
                const isCitationOpen = expandedCitationId === item.mandate_id;
                const plainSummary = getPlainEnglishSummary(item);

                return (
                  <div
                    key={item.mandate_id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isViolation
                        ? 'bg-rose-950/20 border-rose-900/60 border-l-4 border-l-rose-500'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-900/60 border-l-4 border-l-amber-500'
                        : 'bg-[#161F30]/70 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base text-white">
                            {item.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0B0F17] text-slate-300 border border-slate-700/80">
                            {item.rule}
                          </span>
                        </div>

                        {/* Plain English Finding */}
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                          {plainSummary}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-black shrink-0 ${
                          item.status === 'COMPLIANT'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                            : item.status === 'WARNING'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                            : 'bg-rose-950/90 text-rose-300 border border-rose-800/80 animate-pulse'
                        }`}
                      >
                        {item.status === 'COMPLIANT' ? 'PASS' : item.status === 'WARNING' ? 'ADVISORY' : 'VIOLATION'}
                      </span>
                    </div>

                    {/* Detected Content & Action Controls */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider shrink-0">
                          Detected on Packaging:
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#0B0F17] text-slate-200 border border-slate-800 font-mono text-xs font-semibold truncate max-w-sm">
                          {item.extracted_text || '[NOT FOUND ON PACKAGING]'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpotlight(item.mandate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 font-medium text-xs transition-colors shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Spotlight on Canvas</span>
                        </button>

                        <button
                          onClick={() => setExpandedCitationId(isCitationOpen ? null : item.mandate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 font-medium text-xs transition-colors shadow-xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{isCitationOpen ? 'Hide Law Citation' : 'View Gazette Law'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Gazette Law Accordion */}
                    {isCitationOpen && item.gazette_citation && (
                      <div className="mt-3.5 p-4 bg-[#0B0F17]/90 rounded-xl border border-indigo-900/60 space-y-2.5 text-xs text-slate-300 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between font-bold text-indigo-300 text-xs">
                          <span>Official Gazette Ref: {item.gazette_citation.gazette_ref || 'LMPC Rules 2011'}</span>
                          <span className="font-mono bg-indigo-950 px-2 py-0.5 rounded text-[11px] border border-indigo-800/60">
                            {item.gazette_citation.rule || item.rule}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 italic bg-[#161F30]/80 p-3 rounded-lg border border-slate-700/60 leading-relaxed font-serif">
                          "{item.gazette_citation.verbatim_clause || item.gazette_citation.verbatim_text}"
                        </p>

                        {item.gazette_citation.officer_guidance && (
                          <p className="text-xs text-slate-300">
                            <strong className="text-slate-100">Enforcement Directive: </strong>
                            {item.gazette_citation.officer_guidance}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                          <span>Statutory Sanction / Penalty:</span>
                          <span className="font-bold text-rose-400 font-mono">
                            {formatPenaltyText(item.gazette_citation?.penalty_rule)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB B: Barcode, QR & Statutory Packaging Symbols */}
        {activeTab === 'barcodes' && (
          <div className="bg-[#111827]/90 rounded-2xl p-2 border border-slate-800/90 shadow-xl backdrop-blur-sm">
            <BarcodeSymbolsCard
              barcode={report.barcode_data || report.label_data?.barcode_data}
              qr={report.qr_data || report.label_data?.qr_data}
              symbols={report.packaging_symbols || report.label_data?.packaging_symbols}
            />
          </div>
        )}

        {/* TAB C: Packaging Spatial Canvas & OCR */}
        {activeTab === 'canvas' && (
          <section className="space-y-6">
            <div className="bg-[#111827]/90 rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-xl space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Interactive Packaging Canvas &amp; Token Zones
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any highlighted token bounding box on the packaging to inspect its statutory declaration
                  </p>
                </div>
                {selectedMandateId && (
                  <button
                    onClick={() => setSelectedMandateId(null)}
                    className="text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Clear Spotlight
                  </button>
                )}
              </div>

              {/* Multi-Panel Image Switcher */}
              {report.additional_image_urls && report.additional_image_urls.length > 0 && (
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800 overflow-x-auto">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">
                    Panels ({1 + report.additional_image_urls.length}):
                  </span>
                  {[report.image_url || '/presets/compliant_biscuit.svg', ...report.additional_image_urls].map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPanelIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedPanelIndex === idx
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-[#161F30] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
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
                boundingBoxes={report.bounding_boxes || []}
                activeBoxId={activeBoxId}
                onSelectBox={setActiveBoxId}
                selectedMandateId={selectedMandateId}
              />
            </div>

            {/* Raw OCR Text Box */}
            <div className="bg-[#111827]/90 rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-xl space-y-3 backdrop-blur-sm">
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Raw Extracted OCR Text Stream
              </h4>
              <OCRRawTextViewer
                rawText={report.raw_ocr_text}
                extractedFields={report.label_data}
              />
            </div>
          </section>
        )}

        {/* TAB D: Official Gazette Citations (38 Rules) */}
        {activeTab === 'gazette' && (
          <section className="bg-[#111827]/90 rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-xl space-y-4 backdrop-blur-sm">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Statutory Gazette Citations &amp; Legal Authorities
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every citation is retrieved from the 38 statutory rules of the Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(report.checklist || []).map((item) => (
                <div key={item.mandate_id} className="p-4 rounded-xl bg-[#161F30]/80 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0B0F17] text-slate-300 border border-slate-800">
                      {item.rule}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic bg-[#0B0F17] p-3 rounded-lg border border-slate-800 leading-relaxed font-serif">
                    "{item.gazette_citation?.verbatim_clause || item.gazette_citation?.verbatim_text || item.reason}"
                  </p>

                  <div className="text-[11px] flex items-center justify-between text-slate-400 font-medium">
                    <span>Gazette Ref: {item.gazette_citation?.gazette_ref || 'LMPC Rules 2011'}</span>
                    <span className="font-bold text-rose-400 font-mono">
                      {formatPenaltyText(item.gazette_citation?.penalty_rule)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Bottom Actions Bar */}
      <footer className="sticky bottom-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-t border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#161F30] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 font-semibold text-xs transition-colors shadow-xs"
          >
            Close Full Report
          </button>

          <div className="flex items-center gap-3">
            {onOpenComplaint && (
              <button
                onClick={onOpenComplaint}
                className="px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 bg-[#FF2A85] hover:bg-[#e0246f] text-white shadow-[#FF2A85]/20"
              >
                <Flag className="w-4 h-4" />
                <span>File Govt Complaint</span>
              </button>
            )}
            <button
              onClick={onOpenNotice}
              className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                isLawful
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>
                {isLawful ? 'View Compliance Certificate' : 'Issue Rule 32 / Section 36 Notice'}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
