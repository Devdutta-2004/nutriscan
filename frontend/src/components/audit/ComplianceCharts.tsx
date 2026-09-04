import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Calculator, ShieldCheck, Award, TrendingUp, AlertOctagon } from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { calculateProductGrade, calculateDomainScores } from '../../utils/grading';

interface ComplianceChartsProps {
  report: AuditReport;
  onSelectMandate?: (mandateId: string) => void;
}

export const ComplianceCharts: React.FC<ComplianceChartsProps> = ({ report, onSelectMandate }) => {
  const gradeInfo = calculateProductGrade(report);
  const domainScores = calculateDomainScores(report.checklist || []);

  const total = report.summary.total_mandates_checked || 11;
  const compliant = report.summary.compliant_count || 0;
  const warnings = report.summary.warnings_count || 0;
  const violations = report.summary.violations_count || 0;

  // Calculate SVG donut segments
  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const compliantPercent = (compliant / total) * 100;
  const warningPercent = (warnings / total) * 100;
  const violationPercent = (violations / total) * 100;

  const strokeCompliant = (compliantPercent / 100) * circumference;
  const strokeWarning = (warningPercent / 100) * circumference;
  const strokeViolation = (violationPercent / 100) * circumference;

  const offsetCompliant = 0;
  const offsetWarning = -strokeCompliant;
  const offsetViolation = -(strokeCompliant + strokeWarning);

  const usp = report.usp_verification;
  const hasUsp = Boolean(usp && usp.status);
  const isUspValid = usp?.status === 'COMPLIANT';

  return (
    <div className="space-y-5">
      {/* 1. Executive Grading & Pie Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Donut Pie Chart Card */}
        <div className="md:col-span-6 bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Statutory Compliance Breakdown
              </h4>
              <p className="text-[11px] text-zinc-400">11 Legal Metrology Mandates</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-zinc-100 text-zinc-800">
              {report.compliance_score}% Aggregate
            </span>
          </div>

          <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Pie / Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="text-zinc-100"
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  fill="transparent"
                />

                {/* Compliant Arc (Green) */}
                {compliant > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeCompliant} ${circumference}`}
                    strokeDashoffset={offsetCompliant}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                )}

                {/* Warnings Arc (Amber) */}
                {warnings > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="#f59e0b"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeWarning} ${circumference}`}
                    strokeDashoffset={offsetWarning}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                )}

                {/* Violations Arc (Rose) */}
                {violations > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="#ff2a85"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeViolation} ${circumference}`}
                    strokeDashoffset={offsetViolation}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                )}
              </svg>

              {/* Center Seal */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-zinc-900 leading-none">
                  {gradeInfo.grade}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                  GRADE
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-3 text-xs bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-zinc-700">Compliant (Pass)</span>
                </div>
                <strong className="text-emerald-700 font-extrabold font-mono">
                  {compliant} <span className="text-[10px] text-zinc-400">({Math.round(compliantPercent)}%)</span>
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs bg-amber-50/60 border border-amber-100 px-3 py-1.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-zinc-700">Advisories / Warnings</span>
                </div>
                <strong className="text-amber-700 font-extrabold font-mono">
                  {warnings} <span className="text-[10px] text-zinc-400">({Math.round(warningPercent)}%)</span>
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs bg-rose-50/60 border border-rose-100 px-3 py-1.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF2A85] shrink-0" />
                  <span className="font-semibold text-zinc-700">Critical Violations</span>
                </div>
                <strong className="text-rose-700 font-extrabold font-mono">
                  {violations} <span className="text-[10px] text-zinc-400">({Math.round(violationPercent)}%)</span>
                </strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Parent Statute: Legal Metrology Act, 2009</span>
            <span className="font-bold text-zinc-700">Rule 32 Applicable</span>
          </div>
        </div>

        {/* Legal Status & Risk Assessment Card */}
        <div className="md:col-span-6 bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Statutory Assessment &amp; Status
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase ${
                  gradeInfo.lawfulForSale
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {gradeInfo.lawfulForSale ? 'LAWFUL FOR SALE' : 'UNLAWFUL FOR SALE'}
              </span>
            </div>

            <div className="py-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${gradeInfo.badgeBg}`}>
                  {gradeInfo.grade}
                </div>
                <div>
                  <h3 className="font-black text-lg text-zinc-900 leading-tight">
                    {gradeInfo.title}
                  </h3>
                  <p className="text-xs font-bold text-zinc-500 mt-0.5">{gradeInfo.subtitle}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-600 mt-3.5 leading-relaxed bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                {gradeInfo.description}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">Estimated Penalty Exposure:</span>
              <span className="font-bold text-zinc-900 font-mono">{gradeInfo.penaltyEstimate}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">Recommended Action:</span>
              <span className="font-bold text-zinc-800 truncate max-w-[240px]" title={gradeInfo.actionRequired}>
                {gradeInfo.actionRequired}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4-Domain Legal Category Bar Graph */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
              Legal Domain Performance Scores
            </h4>
            <p className="text-[11px] text-zinc-400">
              Evaluating compliance across the 4 core pillars of packaged commodity law
            </p>
          </div>
          <span className="text-[11px] font-bold text-zinc-400">Target: 100% per pillar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {domainScores.map((domain) => {
            const isOptimal = domain.status === 'OPTIMAL';
            const isAdvisory = domain.status === 'ADVISORY';

            return (
              <div
                key={domain.id}
                className="p-3.5 rounded-2xl border border-zinc-200/70 bg-zinc-50/50 hover:bg-zinc-50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="text-xs font-bold text-zinc-800">{domain.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono ${
                      isOptimal
                        ? 'bg-emerald-100 text-emerald-800'
                        : isAdvisory
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {domain.score}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${domain.score}%`,
                      backgroundColor: domain.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                  <span>{domain.description}</span>
                  <span className="font-bold text-zinc-700 font-mono shrink-0 ml-2">
                    {domain.compliantCount}/{domain.totalCount} Pass
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Mathematical USP Verification Visualizer */}
      {hasUsp && (
        <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700">
                  Unit Sale Price (USP) Mathematical Audit
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Governed by Rule 6(1)(s) &amp; Rule 6(11) (G.S.R. 779(E))
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                isUspValid
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
              }`}
            >
              {isUspValid ? 'MATHEMATICALLY ACCURATE' : 'USP STATUTORY MISMATCH'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Printed USP Card */}
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/70">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Printed on Package
              </span>
              <p className="text-base font-black text-zinc-900 mt-1 font-mono">
                {usp?.printed || '[NOT DECLARED]'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">Extracted from packaging OCR</p>
            </div>

            {/* Mandated Calculated USP Card */}
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/70">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Statutory Mandated USP
              </span>
              <p className="text-base font-black text-emerald-600 mt-1 font-mono">
                {usp?.calculated?.expected_display || 'N/A'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {usp?.calculated?.formula || 'MRP ÷ Net Quantity'}
              </p>
            </div>

            {/* Verdict & Discrepancy Card */}
            <div
              className={`p-3.5 rounded-2xl border ${
                isUspValid
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/60 border-rose-200 text-rose-900'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                Compliance Verdict
              </span>
              <p className="text-xs font-black mt-1 leading-snug">
                {isUspValid ? 'Accurate within 2% statutory tolerance' : 'Discrepant / Missing'}
              </p>
              <p className="text-[11px] opacity-90 mt-1">
                {usp?.discrepancy || usp?.reason || 'Valid declaration under Rule 6(1)(s)'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
