import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, CheckCircle2, AlertTriangle, XCircle, 
  BarChart3, Scale, ShieldCheck, ShieldAlert, Award, Calculator, 
  Printer, Image as ImageIcon, CheckSquare, BookOpen, RefreshCw,
  Eye, AlertOctagon, HelpCircle, ExternalLink, Sparkles
} from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { calculateProductGrade, calculateDomainScores, getPlainEnglishSummary } from '../../utils/grading';
import { CanvasViewer } from '../inspection/CanvasViewer';
import { OCRRawTextViewer } from './OCRRawTextViewer';

interface FullPageReportProps {
  report: AuditReport | null;
  onClose: () => void;
  onOpenNotice: () => void;
  onRescan?: () => void;
}

export const FullPageReport: React.FC<FullPageReportProps> = ({
  report,
  onClose,
  onOpenNotice,
  onRescan,
}) => {
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [selectedMandateId, setSelectedMandateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mandates' | 'canvas' | 'gazette'>('overview');
  const [filter, setFilter] = useState<'ALL' | 'VIOLATION' | 'WARNING' | 'COMPLIANT'>('ALL');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  if (!report) return null;

  const gradeInfo = calculateProductGrade(report);
  const domainScores = calculateDomainScores(report.checklist || []);

  const total = report.summary.total_mandates_checked || 11;
  const compliant = report.summary.compliant_count || 0;
  const warnings = report.summary.warnings_count || 0;
  const violations = report.summary.violations_count || 0;

  // Donut Pie Chart calculations
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F0EDE3] text-zinc-900 selection:bg-[#FF2A85]/20 selection:text-[#FF2A85] flex flex-col animate-in fade-in duration-200">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed -top-20 -right-20 w-96 h-96 rounded-full bg-[#E5F792] opacity-60 blur-3xl pointer-events-none -z-0" />
      <div className="fixed top-1/3 -left-20 w-80 h-96 rounded-full bg-[#FFD1DC] opacity-50 blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 rounded-full bg-[#E0F7FA] opacity-50 blur-3xl pointer-events-none -z-0" />

      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 flex items-center gap-1.5 font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Scanner</span>
            </button>

            <div className="h-5 w-px bg-zinc-200 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                Full Statutory Audit Report
              </span>
              <h1 className="text-base sm:text-lg font-black text-zinc-900 truncate max-w-[280px] sm:max-w-md leading-none mt-0.5">
                {report.product_name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onRescan && (
              <button
                onClick={onRescan}
                className="hidden sm:flex px-3.5 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rescan</span>
              </button>
            )}

            <button
              onClick={onOpenNotice}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                gradeInfo.lawfulForSale
                  ? 'bg-[#D5FF3F] text-zinc-950 hover:bg-[#c9f635]'
                  : 'bg-[#FF2A85] text-white hover:bg-rose-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">
                {gradeInfo.lawfulForSale ? 'View Official Certificate' : 'Issue Rule 32 Legal Notice'}
              </span>
              <span className="sm:hidden">
                {gradeInfo.lawfulForSale ? 'Certificate' : 'Legal Notice'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Page Scrollable Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 relative z-10">
        
        {/* 1. Hero Summary & Product Identity Card */}
        <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm relative overflow-hidden">
          
          {/* Subtle Watermark Seal in background */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Scale className="w-64 h-64 text-zinc-900" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Product & Grade Identity */}
            <div className="flex items-start gap-5">
              {/* Giant Grade Seal Badge */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center font-black shadow-md shrink-0 ${gradeInfo.badgeBg}`}
              >
                <span className="text-3xl sm:text-4xl leading-none">{gradeInfo.grade}</span>
                <span className="text-[10px] sm:text-[11px] tracking-widest uppercase font-bold mt-1 opacity-90">
                  GRADE
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-mono font-bold">
                    {report.audit_id}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      gradeInfo.lawfulForSale
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    }`}
                  >
                    {gradeInfo.lawfulForSale ? 'LAWFUL FOR DISTRIBUTION' : 'STATUTORY CONTRAVENTION DETECTED'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                  {report.product_name}
                </h2>

                <p className="text-sm font-semibold text-zinc-500 max-w-xl">
                  {gradeInfo.description}
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-zinc-600 flex-wrap">
                  <span>
                    Audit Time: <strong className="text-zinc-900">{new Date(report.audit_timestamp).toLocaleString('en-IN')}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Corpus: <strong className="text-indigo-600 font-mono">LMPC Gazette v{report.corpus_version || '2024.1'}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Penalty Liability: <strong className="text-rose-600 font-mono">{gradeInfo.penaltyEstimate}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Stat Tiles */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 text-center min-w-[130px]">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                  Compliance Score
                </span>
                <p className="text-3xl font-black text-zinc-900 mt-1 font-mono">
                  {report.compliance_score}%
                </p>
                <span className="text-[11px] text-zinc-500 font-semibold">
                  11 Mandates Evaluated
                </span>
              </div>

              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 text-center min-w-[130px]">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                  Defects Found
                </span>
                <p className={`text-3xl font-black mt-1 font-mono ${violations > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {violations}
                </p>
                <span className="text-[11px] text-zinc-500 font-semibold">
                  {violations === 0 ? 'Zero Violations' : 'Non-Compliant Items'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Visual Graphs & Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Donut / Pie Chart Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-7 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700">
                  Statutory Compliance Proportions
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Visual breakdown across 11 mandatory packaging declarations
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-zinc-100 text-zinc-800">
                11 Legal Mandates
              </span>
            </div>

            <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-8">
              
              {/* Interactive SVG Donut Pie Chart */}
              <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  {/* Track ring */}
                  <circle cx="80" cy="80" r={radius} stroke="#f4f4f5" strokeWidth={strokeWidth} fill="none" />

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
                      stroke="#FF2A85"
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
                  <span className="text-4xl font-black text-zinc-900 tracking-tight leading-none">
                    {gradeInfo.grade}
                  </span>
                  <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest mt-1">
                    {report.compliance_score}%
                  </span>
                </div>
              </div>

              {/* Legend with Interactive Hover Highlighting */}
              <div className="space-y-3 w-full sm:w-64">
                <div
                  onMouseEnter={() => setHoveredSlice('compliant')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    hoveredSlice === 'compliant'
                      ? 'bg-emerald-100/70 border-emerald-300 scale-102'
                      : 'bg-emerald-50/50 border-emerald-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="font-extrabold text-xs text-zinc-800">Compliant (Pass)</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Satisfies statutory rules</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-emerald-700">
                    {compliant} <span className="text-[11px] text-zinc-400">({Math.round(compliantPercent)}%)</span>
                  </span>
                </div>

                <div
                  onMouseEnter={() => setHoveredSlice('warnings')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    hoveredSlice === 'warnings'
                      ? 'bg-amber-100/70 border-amber-300 scale-102'
                      : 'bg-amber-50/50 border-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <p className="font-extrabold text-xs text-zinc-800">Format Advisories</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Non-penal corrections</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-amber-700">
                    {warnings} <span className="text-[11px] text-zinc-400">({Math.round(warningPercent)}%)</span>
                  </span>
                </div>

                <div
                  onMouseEnter={() => setHoveredSlice('violations')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    hoveredSlice === 'violations'
                      ? 'bg-rose-100/70 border-rose-300 scale-102'
                      : 'bg-rose-50/50 border-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF2A85] shrink-0" />
                    <div>
                      <p className="font-extrabold text-xs text-zinc-800">Critical Violations</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Rule 32 penalty risk</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-rose-700">
                    {violations} <span className="text-[11px] text-zinc-400">({Math.round(violationPercent)}%)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span>Authority: Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
              <span className="font-bold text-zinc-800 font-mono">G.S.R. 784(E) 2024</span>
            </div>
          </div>

          {/* 4 Pillars Legal Category Graph (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[32px] p-6 sm:p-7 border border-zinc-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700">
                  4 Legal Domain Pillar Scores
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Performance across core statutory domains
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-400 font-mono">Goal: 100%</span>
            </div>

            <div className="space-y-3.5 py-1">
              {domainScores.map((domain) => (
                <div key={domain.id} className="space-y-1.5 bg-zinc-50/70 p-3 rounded-2xl border border-zinc-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.color }} />
                      <span className="font-extrabold text-zinc-800">{domain.name}</span>
                    </div>
                    <span className="font-black font-mono text-zinc-900 text-xs">
                      {domain.score}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${domain.score}%`, backgroundColor: domain.color }}
                    />
                  </div>

                  <p className="text-[10px] text-zinc-500 font-medium pt-0.5">
                    {domain.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 font-medium">
              Evaluated using automated Legal Metrology Act compliance rules.
            </div>
          </div>
        </section>

        {/* 3. Mathematical USP Verification Visualizer */}
        {usp && (
          <section className="bg-white rounded-[32px] p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                    Unit Sale Price (USP) Mathematical Verification
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Statutory formula audit under Rule 6(1)(s) and Rule 6(11) (G.S.R. 779(E))
                  </p>
                </div>
              </div>

              <span
                className={`px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                  isUspValid
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                }`}
              >
                {isUspValid ? 'STATUTORILY ACCURATE' : 'USP STATUTORY MISMATCH / OMITTED'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Printed on Label
                </span>
                <p className="text-xl font-black text-zinc-900 font-mono">
                  {usp.printed || '[NOT DECLARED]'}
                </p>
                <p className="text-xs text-zinc-500">Extracted from packaging text token scan</p>
              </div>

              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Mandated Calculated Rate
                </span>
                <p className="text-xl font-black text-emerald-600 font-mono">
                  {usp.calculated?.expected_display || 'N/A'}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  Formula: {usp.calculated?.formula || 'MRP ÷ Net Quantity'}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-1 ${
                  isUspValid
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  Enforcement Finding
                </span>
                <p className="text-sm font-black leading-snug">
                  {isUspValid ? 'Mathematical Tolerance Satisfied' : 'Actionable Discrepancy'}
                </p>
                <p className="text-xs opacity-90">
                  {usp.discrepancy || usp.reason || 'Unit sale price matches statutory standard.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 4. Tab Navigation for Detailed Sections */}
        <div className="flex items-center gap-2 border-b border-zinc-300 pb-2 overflow-x-auto text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>11 Mandates Breakdown ({compliant}/{total})</span>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'canvas'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Packaging Spatial Canvas &amp; Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab('gazette')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'gazette'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Gazette Citations (38 Rules)</span>
          </button>
        </div>

        {/* TAB A: 11 Mandates Breakdown */}
        {activeTab === 'overview' && (
          <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-5">
            
            {/* Filter Pills Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Statutory Clause Inspection List
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Click any item to expand its official Gazette law or spotlight its location on the packaging
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'ALL' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  All ({report.checklist?.length || 11})
                </button>
                {violations > 0 && (
                  <button
                    onClick={() => setFilter('VIOLATION')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'VIOLATION' ? 'bg-rose-500 text-white shadow-sm' : 'text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    Violations ({violations})
                  </button>
                )}
                {warnings > 0 && (
                  <button
                    onClick={() => setFilter('WARNING')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'WARNING' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Advisories ({warnings})
                  </button>
                )}
                <button
                  onClick={() => setFilter('COMPLIANT')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'COMPLIANT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  Pass ({compliant})
                </button>
              </div>
            </div>

            {/* Mandate Cards Grid */}
            <div className="space-y-3.5">
              {filteredItems.map((item) => {
                const isViolation = item.status === 'VIOLATION';
                const isWarning = item.status === 'WARNING';
                const isCitationOpen = expandedCitationId === item.mandate_id;
                const plainSummary = getPlainEnglishSummary(item);

                return (
                  <div
                    key={item.mandate_id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isViolation
                        ? 'bg-rose-50/40 border-rose-200'
                        : isWarning
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-sm sm:text-base text-zinc-900">
                            {item.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                            {item.rule}
                          </span>
                        </div>

                        {/* Plain English Finding */}
                        <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                          {plainSummary}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                          item.status === 'COMPLIANT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : item.status === 'WARNING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                        }`}
                      >
                        {item.status === 'COMPLIANT' ? 'PASS' : item.status === 'WARNING' ? 'ADVISORY' : 'VIOLATION'}
                      </span>
                    </div>

                    {/* Detected Content & Action Controls */}
                    <div className="mt-3.5 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider shrink-0">
                          Detected on Packaging:
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-xs font-semibold truncate max-w-sm">
                          {item.extracted_text || '[NOT FOUND ON PACKAGING]'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpotlight(item.mandate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Spotlight on Image</span>
                        </button>

                        <button
                          onClick={() => setExpandedCitationId(isCitationOpen ? null : item.mandate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isCitationOpen ? 'Hide Law Citation' : 'View Gazette Law'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Gazette Law Accordion */}
                    {isCitationOpen && item.gazette_citation && (
                      <div className="mt-3.5 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2 text-xs text-zinc-700 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between font-bold text-indigo-950 text-xs">
                          <span>Official Gazette Ref: {item.gazette_citation.gazette_ref || 'LMPC Rules 2011'}</span>
                          <span className="font-mono bg-indigo-100 px-2 py-0.5 rounded text-[11px]">
                            {item.gazette_citation.rule || item.rule}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-800 italic bg-white p-3 rounded-xl border border-indigo-100 leading-relaxed font-serif">
                          "{item.gazette_citation.verbatim_clause || item.gazette_citation.verbatim_text}"
                        </p>

                        {item.gazette_citation.officer_guidance && (
                          <p className="text-xs text-zinc-600">
                            <strong className="text-zinc-900">Enforcement Directive: </strong>
                            {item.gazette_citation.officer_guidance}
                          </p>
                        )}

                        <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-xs font-semibold text-indigo-900">
                          <span>Statutory Sanction / Penalty:</span>
                          <span className="font-bold text-rose-700 font-mono">
                            {item.gazette_citation.penalty_rule || 'Rule 32 (Fine up to ₹25,000)'}
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

        {/* TAB B: Packaging Spatial Canvas & OCR */}
        {activeTab === 'canvas' && (
          <section className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                    Interactive Packaging Canvas &amp; Token Zones
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Click any highlighted token on the packaging image to inspect its legal declaration
                  </p>
                </div>
                {selectedMandateId && (
                  <button
                    onClick={() => setSelectedMandateId(null)}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-800"
                  >
                    Clear Spotlight
                  </button>
                )}
              </div>

              <CanvasViewer
                imageUrl={report.image_url || '/presets/compliant_biscuit.svg'}
                boundingBoxes={report.bounding_boxes || []}
                activeBoxId={activeBoxId}
                onSelectBox={setActiveBoxId}
                selectedMandateId={selectedMandateId}
              />
            </div>

            {/* Raw OCR Text Box */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                Raw Extracted OCR Text Stream
              </h4>
              <OCRRawTextViewer
                rawText={report.raw_ocr_text}
                extractedFields={report.label_data}
              />
            </div>
          </section>
        )}

        {/* TAB C: Official Gazette Citations */}
        {activeTab === 'gazette' && (
          <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-4">
            <div className="pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                Statutory Gazette Citations &amp; Legal Authorities
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every citation is retrieved from the 38 statutory rules of the Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(report.checklist || []).map((item) => (
                <div key={item.mandate_id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-zinc-900">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200 text-zinc-800">
                      {item.rule}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 italic bg-white p-3 rounded-xl border border-zinc-200/60 leading-relaxed font-serif">
                    "{item.gazette_citation?.verbatim_clause || item.gazette_citation?.verbatim_text || item.reason}"
                  </p>

                  <div className="text-[11px] flex items-center justify-between text-zinc-500 font-medium">
                    <span>Gazette Ref: {item.gazette_citation?.gazette_ref || 'LMPC Rules 2011'}</span>
                    <span className="font-bold text-rose-700 font-mono">
                      {item.gazette_citation?.penalty_rule || 'Rule 32'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Bottom Actions Bar */}
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors"
          >
            Close Full Report
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNotice}
              className={`px-6 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                gradeInfo.lawfulForSale
                  ? 'bg-[#D5FF3F] text-zinc-950 hover:bg-[#c9f635]'
                  : 'bg-[#FF2A85] text-white hover:bg-rose-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>
                {gradeInfo.lawfulForSale ? 'View Compliance Certificate' : 'Issue Rule 32 / Section 36 Notice'}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
