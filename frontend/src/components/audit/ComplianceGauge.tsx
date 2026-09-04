import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Award } from 'lucide-react';

interface ComplianceGaugeProps {
  score: number;
  violationsCount: number;
  warningsCount: number;
  legalStatus: string;
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({
  score,
  violationsCount,
  warningsCount,
  legalStatus,
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 90) return { stroke: '#10b981', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' };
    if (s >= 70) return { stroke: '#fbbf24', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' };
    return { stroke: '#f43f5e', text: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-md relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: colors.stroke }}
      />

      {/* Left: Animated Radial Progress Meter */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#27272a"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold font-mono tracking-tight ${colors.text}`}>
            {score}%
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Compliance
          </span>
        </div>
      </div>

      {/* Right: Regulatory Verdict & Breakdown */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
          {score === 100 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUTORILY COMPLIANT
            </span>
          ) : violationsCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <XCircle className="w-3.5 h-3.5" />
              STATUTORY CONTRAVENTIONS DETECTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              COMPLIANT WITH ADVISORY WARNINGS
            </span>
          )}
        </div>

        <h4 className="text-sm font-semibold text-zinc-200">
          {violationsCount === 0
            ? 'All Big-8 Legal Metrology declarations verified and mathematically accurate.'
            : `${violationsCount} mandatory declarations violate LMPC 2011 & 2024 Gazette amendments.`}
        </h4>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="p-2 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Pass</p>
            <p className="text-base font-bold text-emerald-400 font-mono">
              {8 - violationsCount - warningsCount}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Warnings</p>
            <p className="text-base font-bold text-amber-400 font-mono">{warningsCount}</p>
          </div>
          <div className="p-2 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Violations</p>
            <p className="text-base font-bold text-rose-400 font-mono">{violationsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
