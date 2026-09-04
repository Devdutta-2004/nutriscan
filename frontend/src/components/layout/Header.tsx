import React from 'react';
import { ShieldCheck, Scale, FileText, Sparkles, AlertTriangle } from 'lucide-react';
import { DemoPreset, AuditReport } from '../../types/compliance';

interface HeaderProps {
  presets: DemoPreset[];
  activePresetId?: string;
  onSelectPreset: (presetId: string) => void;
  onOpenNotice: () => void;
  report: AuditReport | null;
}

export const Header: React.FC<HeaderProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onOpenNotice,
  report,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090d]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                Fair<span className="text-emerald-400">Pack</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                LMPC 2024
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Packaging Compliance & Regulatory RAG Platform
            </p>
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="hidden md:flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-white/[0.06]">
          <span className="text-[11px] font-medium text-zinc-400 px-2.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Presets:
          </span>
          {presets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {preset.expected_score === 100 ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
                {preset.title.split(' ')[0]} {preset.title.includes('(') ? preset.title.split('(')[1].replace(')', '') : ''}
              </button>
            );
          })}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          {report && (
            <button
              onClick={onOpenNotice}
              className="group relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-white/10 hover:border-white/20 transition-all shadow-sm active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Notice of Non-Compliance</span>
              {report.summary.violations_count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  {report.summary.violations_count}
                </span>
              )}
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Deterministic RAG Engine
          </div>
        </div>
      </div>
    </header>
  );
};
