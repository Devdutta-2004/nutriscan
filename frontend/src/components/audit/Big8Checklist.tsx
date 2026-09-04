import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, CornerDownRight } from 'lucide-react';
import { ChecklistItem, ComplianceStatus } from '../../types/compliance';

interface Big8ChecklistProps {
  checklist: ChecklistItem[];
  selectedMandateId: string | null;
  onSelectMandate: (mandateId: string) => void;
}

export const Big8Checklist: React.FC<Big8ChecklistProps> = ({
  checklist,
  selectedMandateId,
  onSelectMandate,
}) => {
  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3" />
            PASS
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      case 'VIOLATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/25 animate-pulse">
            <XCircle className="w-3 h-3" />
            VIOLATION
          </span>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
          Big-8 Statutory Checklist
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">
          Click item to spotlight on packaging
        </span>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {checklist.map((item) => {
          const isSelected = selectedMandateId === item.mandate_id;
          const isViolation = item.status === 'VIOLATION';
          const isWarning = item.status === 'WARNING';

          return (
            <div
              key={item.mandate_id}
              onClick={() => onSelectMandate(item.mandate_id)}
              className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-zinc-800 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                  : 'bg-zinc-900/50 hover:bg-zinc-850 border-white/[0.06] hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isViolation
                        ? 'bg-rose-500 animate-ping'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{item.rule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(item.status)}
                  <ChevronRight
                    className={`w-4 h-4 text-zinc-500 transition-transform ${
                      isSelected ? 'rotate-90 text-emerald-400' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Collapsed / Expanded finding preview */}
              <div className="mt-2 pt-2 border-t border-white/[0.04] text-[11px] flex items-start gap-1.5">
                <CornerDownRight className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-zinc-300">
                  <span className="text-zinc-400 font-medium mr-1">Declaration:</span>
                  <span className="font-mono text-zinc-200">{item.extracted_text || 'None'}</span>
                  <p
                    className={`mt-0.5 ${
                      isViolation ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-zinc-400'
                    }`}
                  >
                    {item.reason}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
