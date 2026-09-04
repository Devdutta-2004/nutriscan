import React, { useState } from 'react';
import { BookOpen, Scale, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ChecklistItem } from '../../types/compliance';

interface GazetteDrawerProps {
  selectedItem?: ChecklistItem | null;
}

export const GazetteDrawer: React.FC<GazetteDrawerProps> = ({ selectedItem }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!selectedItem?.gazette_citation) {
    return (
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center text-xs text-zinc-500 font-mono">
        Select any Big-8 item above to view its verbatim Gazette citation.
      </div>
    );
  }

  const citation = selectedItem.gazette_citation;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-md overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-zinc-850/60 hover:bg-zinc-800/80 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-sans">
              Statutory Gazette Grounding
            </h4>
            <p className="text-[10px] font-mono text-emerald-400">{citation.rule}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline-block">
            {citation.gazette_ref}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4 space-y-3 text-xs border-t border-white/[0.06]">
          {/* Gazette Reference Header */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-950/70 border border-white/[0.06] font-mono text-[11px]">
            <span className="text-zinc-400">Official Publication Ref:</span>
            <span className="text-amber-300 font-semibold">{citation.gazette_ref}</span>
          </div>

          {/* Verbatim Gazette Quote */}
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
              <Scale className="w-3 h-3 text-emerald-400" />
              Verbatim Statutory Provision
            </p>
            <div className="p-3 rounded-xl bg-zinc-950/90 border border-white/[0.08] text-zinc-200 font-serif italic text-xs leading-relaxed border-l-2 border-l-emerald-500">
              "{citation.verbatim_clause}"
            </div>
          </div>

          {/* Legal Metrology Officer Guidance */}
          {citation.officer_guidance && (
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-cyan-400" />
                Legal Metrology Officer Inspection Directive
              </p>
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-200 text-[11.5px] leading-normal">
                {citation.officer_guidance}
              </div>
            </div>
          )}

          {/* Sanction Provision */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-[11px]">
            <span className="font-semibold">Applicable Sanction Provision:</span>
            <span className="font-mono font-bold">
              {typeof citation.penalty_rule === 'object'
                ? (citation.penalty_rule as any)?.title || (citation.penalty_rule as any)?.id || 'Rule 32'
                : citation.penalty_rule || 'Rule 32'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
