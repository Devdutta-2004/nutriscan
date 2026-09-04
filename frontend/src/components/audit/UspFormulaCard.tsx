import React from 'react';
import { Calculator, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { USPVerification } from '../../types/compliance';

interface UspFormulaCardProps {
  usp: USPVerification;
  onHighlightMandate?: () => void;
}

export const UspFormulaCard: React.FC<UspFormulaCardProps> = ({ usp, onHighlightMandate }) => {
  const isViolation = usp.status === 'VIOLATION';
  const isCompliant = usp.status === 'COMPLIANT';
  const isWarning = usp.status === 'WARNING';

  return (
    <div
      onClick={onHighlightMandate}
      className={`group cursor-pointer p-4 sm:p-5 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
        isViolation
          ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)]'
          : isWarning
          ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_25px_rgba(251,191,36,0.15)]'
          : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl border ${
              isViolation
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : isWarning
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Deterministic USP Engine
            </h4>
            <span className="text-[11px] font-mono text-zinc-400">
              Statutory Formula: Rule 6(1)(s) (2024 Amendment)
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide border flex items-center gap-1.5 ${
            isViolation
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : isWarning
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {isViolation ? (
            <>
              <AlertOctagon className="w-3.5 h-3.5" />
              VIOLATION
            </>
          ) : isWarning ? (
            <>
              <HelpCircle className="w-3.5 h-3.5" />
              WARNING
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              ACCURATE
            </>
          )}
        </span>
      </div>

      {/* Kinetic Math Formula Display Block */}
      {usp.calculated && (
        <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/[0.08] font-mono text-xs text-zinc-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2 mb-2">
            <span className="text-zinc-400">Statutory Mathematical Model:</span>
            <span className="text-emerald-400 font-bold">{usp.calculated.formula}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-sans">
                Statutory Required USP
              </p>
              <p className="font-bold text-emerald-400 text-base">
                {usp.calculated.expected_display}
                {usp.calculated.alt_display && (
                  <span className="text-xs text-zinc-400 font-normal ml-1">
                    or {usp.calculated.alt_display}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center text-zinc-500">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-sans">
                Printed On Label
              </p>
              <p
                className={`font-bold text-base ${
                  isViolation
                    ? 'text-rose-400 line-through'
                    : isWarning
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {usp.printed || 'NOT DECLARED'}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-sans">
                Calculated Variance
              </p>
              <p
                className={`font-bold text-base ${
                  isViolation ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {isCompliant
                  ? '0.00% (Exact Match)'
                  : usp.printed
                  ? 'Mathematical Mismatch'
                  : '100% Defect (Missing)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Observation text */}
      <div className="mt-3 flex items-start gap-2 text-xs text-zinc-300">
        <span className="text-zinc-400 font-medium">Finding:</span>
        <span className={isViolation ? 'text-rose-300 font-medium' : 'text-zinc-300'}>
          {usp.reason}
        </span>
      </div>
    </div>
  );
};
