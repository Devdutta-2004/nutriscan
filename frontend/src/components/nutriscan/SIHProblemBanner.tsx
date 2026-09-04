import React, { useState } from 'react';
import { Scale, ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Award, FileText } from 'lucide-react';

interface SIHProblemBannerProps {
  onOpenNotice?: () => void;
}

export const SIHProblemBanner: React.FC<SIHProblemBannerProps> = ({ onOpenNotice }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="pt-2 pb-1">
      {/* Official Government & SIH Banner Container */}
      <div className="bg-[#0E1118] text-white rounded-2xl p-3 sm:p-4 border border-zinc-800 shadow-md relative overflow-hidden">
        {/* Neon Lime Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D5FF3F] via-[#26E1E8] to-[#FF2A85]" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {/* National Emblem / Scales Icon */}
            <div className="w-8 h-8 rounded-xl bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-[#D5FF3F] shrink-0 mt-0.5">
              <Scale className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-[#D5FF3F] text-zinc-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  SIH26034
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Smart India Hackathon
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                  Active System
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                Ministry of Consumer Affairs, Food &amp; Public Distribution
              </h4>

              <p className="text-[11px] text-zinc-300 font-medium leading-snug">
                Software System to check compliance of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011 &amp; 2024 Amendments.
              </p>
            </div>
          </div>

          {/* Toggle Expand / Info */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0"
            title={isExpanded ? 'Collapse SIH Details' : 'Expand Problem Statement'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Statutory Architecture & Problem Statement Mapping */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2.5 text-xs text-zinc-300 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[9.5px] font-mono text-[#D5FF3F] font-bold uppercase">1. Scan &amp; OCR Engine</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  High-speed label scanning, contrast normalization, deskewing &amp; text token extraction.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[9.5px] font-mono text-[#26E1E8] font-bold uppercase">2. Deterministic LMPC Audit</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Mandatory Rule 6 checks: USP calculation, MRP inclusive tax clause, Manufacturer/Importer with PIN code, &amp; Consumer Care.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[9.5px] font-mono text-[#FF2A85] font-bold uppercase">3. Gazette &amp; Rule 32 Orders</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Citation grounding against Gazette G.S.R. 784(E) with instant PDF/print of Statutory Notices.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-400">
                  Target: 100% Zero-Hallucination Regulatory Grounding
                </span>
              </div>

              {onOpenNotice && (
                <button
                  onClick={onOpenNotice}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#D5FF3F] hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Rule 32 Notice Template</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
