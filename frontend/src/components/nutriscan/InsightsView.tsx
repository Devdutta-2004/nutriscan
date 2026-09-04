import React from 'react';
import { ArrowUpRight, Award, ShieldCheck, Heart, AlertTriangle, TrendingUp } from 'lucide-react';

interface InsightsViewProps {
  onBackToHome: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onBackToHome }) => {
  return (
    <div className="space-y-4 pt-2 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            Nutritional &amp; Compliance Insights
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Weekly analytics across 48 scanned packaged goods
          </p>
        </div>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">Avg Nutri-Grade</span>
            <span className="p-1 rounded-lg bg-[#D5FF3F] text-zinc-950 font-black text-xs">
              A
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2">88% Clean</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12% vs last week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">LMPC Verified</span>
            <span className="p-1 rounded-lg bg-[#26E1E8] text-zinc-950 font-black text-xs">
              LMPC
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2">92% Lawful</p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">4 USP mismatches flagged</p>
        </div>
      </div>

      {/* Macro Breakdown Bars */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm space-y-3">
        <h4 className="text-sm font-extrabold text-zinc-900">
          Macronutrient Daily Intake vs Goals
        </h4>

        {/* Protein */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-zinc-700">Protein (Target: 60g)</span>
            <span className="text-[#26E1E8]">54g (90%)</span>
          </div>
          <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#26E1E8] rounded-full" style={{ width: '90%' }} />
          </div>
        </div>

        {/* Fiber */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-zinc-700">Dietary Fiber (Target: 30g)</span>
            <span className="text-[#D5FF3F]">24g (80%)</span>
          </div>
          <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#D5FF3F] rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Added Sugar Alert */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-zinc-700">Added Sugar (Limit: 25g)</span>
            <span className="text-[#FF2A85]">28g (High)</span>
          </div>
          <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF2A85] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Regulatory Health Meter */}
      <div className="bg-[#0E1118] text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-4">
        <div>
          <span className="px-2 py-0.5 rounded-full bg-[#D5FF3F] text-zinc-950 font-black text-[10px] tracking-wider uppercase">
            FairPack Regulatory Shield
          </span>
          <h4 className="text-base font-extrabold text-white mt-1.5">
            Active Consumer Protection
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Zero reliance on deceptive marketing tricks. All packages cross-referenced with
            Gazette statutory rules.
          </p>
        </div>
        <ShieldCheck className="w-12 h-12 text-[#D5FF3F] shrink-0" />
      </div>
    </div>
  );
};
