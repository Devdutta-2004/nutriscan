import React from 'react';
import { ArrowUpRight, Award, ShieldCheck, Scale, AlertTriangle, TrendingUp, BarChart3, PieChart, FileText } from 'lucide-react';

interface InsightsViewProps {
  onBackToHome: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onBackToHome }) => {
  const violationsByClause = [
    { rule: 'Rule 6(1)(s)', title: 'Unit Sale Price (USP) Mismatch or Missing', count: 18, percentage: 38, color: '#FF2A85' },
    { rule: 'Rule 10', title: 'Manufacturer Address Missing 6-digit PIN Code', count: 14, percentage: 29, color: '#F59E0B' },
    { rule: 'Rule 6(1)(d)', title: 'MRP Omitted "inclusive of all taxes" Statement', count: 9, percentage: 19, color: '#8B5CF6' },
    { rule: 'Rule 6(1)(h)', title: 'Consumer Care Incomplete (Missing Email/Phone)', count: 4, percentage: 8, color: '#3B82F6' },
    { rule: 'Rule 18(2A)', title: 'Dual MRP Detected across Sales Channels', count: 3, percentage: 6, color: '#EC4899' },
  ];

  const gradeDistribution = [
    { grade: 'A+', label: 'Exemplary', count: 24, percent: 50, color: '#10B981' },
    { grade: 'A', label: 'Compliant', count: 12, percent: 25, color: '#059669' },
    { grade: 'B', label: 'Advisory', count: 7, percent: 15, color: '#F59E0B' },
    { grade: 'C', label: 'Non-Compliant', count: 4, percent: 8, color: '#F97316' },
    { grade: 'F', label: 'Critical Violation', count: 1, percent: 2, color: '#FF2A85' },
  ];

  return (
    <div className="space-y-5 pt-2 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-zinc-800" />
            <span>Legal Metrology Compliance Analytics</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Aggregated intelligence across 48 evaluated packaged commodities under LMPC Rules, 2011
          </p>
        </div>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Overall Pass Rate
          </span>
          <p className="text-2xl font-black text-zinc-900 mt-1 font-mono">89.6%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Lawful for Retail Sale
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Average Grade
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="px-2 py-0.5 rounded-lg bg-[#D5FF3F] text-zinc-950 font-black text-base">
              A
            </span>
            <span className="text-xs font-bold text-zinc-600">Fully Compliant</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Across 11 mandates</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Section 36 Notices
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1 font-mono">5</p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Improvement notices needed</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Corpus Grounding
          </span>
          <p className="text-2xl font-black text-indigo-600 mt-1 font-mono">38 Rules</p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">RAG Gazette v2024.1</p>
        </div>
      </div>

      {/* 1. Grade Distribution Visual Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700">
              Product Compliance Grade Distribution
            </h4>
            <p className="text-[11px] text-zinc-400">
              Classification of scanned inventory into 5 statutory compliance tiers
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-500 font-mono">Total: 48 Scans</span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden flex shadow-inner">
          {gradeDistribution.map((g) => (
            <div
              key={g.grade}
              style={{ width: `${g.percent}%`, backgroundColor: g.color }}
              title={`Grade ${g.grade}: ${g.count} packages (${g.percent}%)`}
              className="h-full transition-all duration-500 hover:opacity-85 cursor-pointer first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        {/* Grade Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {gradeDistribution.map((g) => (
            <div
              key={g.grade}
              className="p-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/70 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs text-white"
                  style={{ backgroundColor: g.color }}
                >
                  {g.grade}
                </span>
                <span className="text-xs font-black text-zinc-900 font-mono">{g.percent}%</span>
              </div>
              <p className="text-[11px] font-bold text-zinc-700">{g.label}</p>
              <p className="text-[10px] text-zinc-400 font-mono">{g.count} commodities</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Non-Compliance Causes Bar Graph */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700">
              Statutory Defect Frequency by Legal Clause
            </h4>
            <p className="text-[11px] text-zinc-400">
              Most frequent non-compliances flagged by optical character verification
            </p>
          </div>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            Enforcement Hotspots
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {violationsByClause.map((v) => (
            <div key={v.rule} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {v.rule}
                  </span>
                  <span className="font-bold text-zinc-800">{v.title}</span>
                </div>
                <span className="font-extrabold font-mono text-zinc-900 text-[11px]">
                  {v.count} incidents ({v.percentage}%)
                </span>
              </div>

              <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${v.percentage}%`, backgroundColor: v.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Notice & Enforcement Shield Banner */}
      <div className="bg-[#0E1118] text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D5FF3F] text-zinc-950 font-black text-[10px] tracking-wider uppercase">
            Legal Metrology Act, 2009 Standards
          </span>
          <h4 className="text-base font-extrabold text-white">
            Automated Statutory Enforcement
          </h4>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            All audits execute deterministic checks across Unit Sale Price tolerances, date formatting, and registered importer verification, automatically compiling Rule 32 / Section 36 inspection notice drafts.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="px-5 py-2.5 rounded-2xl bg-[#D5FF3F] hover:bg-[#c9f635] text-zinc-950 font-black text-xs shrink-0 transition-all active:scale-95 shadow-sm"
        >
          Scan New Specimen
        </button>
      </div>
    </div>
  );
};
