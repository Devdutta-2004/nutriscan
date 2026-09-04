import React from 'react';
import { FileText, ShieldAlert, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { AuditReport } from '../../types/compliance';

interface FloatingDockProps {
  report: AuditReport | null;
  onOpenNotice: () => void;
  onReset: () => void;
  onFilterViolations: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  report,
  onOpenNotice,
  onReset,
  onFilterViolations,
}) => {
  if (!report) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-white/15 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        {/* Compliance Status Chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 text-xs font-medium border border-white/5">
          <span
            className={`w-2 h-2 rounded-full ${
              report.compliance_score === 100
                ? 'bg-emerald-400'
                : report.compliance_score >= 70
                ? 'bg-amber-400'
                : 'bg-rose-400 animate-pulse'
            }`}
          />
          <span className="text-zinc-200 font-mono font-bold">{report.compliance_score}%</span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            {report.summary.violations_count} Violations
          </span>
        </div>

        {/* Quick Filter Violations */}
        {report.summary.violations_count > 0 && (
          <button
            onClick={onFilterViolations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-all active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Inspect Violations</span>
          </button>
        )}

        {/* Generate Notice */}
        <button
          onClick={onOpenNotice}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Rule 32 Notice</span>
        </button>

        {/* Reset / Reload */}
        <button
          onClick={onReset}
          title="Reload Specimen"
          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
