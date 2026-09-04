import React from 'react';
import { ShieldCheck, CheckCircle2, Cpu, BookOpen, Layers } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.06]">
        <div>
          {/* Regulatory Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 mb-3 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Statutory Verification Engine</span>
            <span className="text-zinc-500">•</span>
            <span className="text-emerald-400 font-semibold">G.S.R. 784(E) 2024 Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Autonomous Label Compliance &{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Gazette RAG Audit
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Instant mathematical inspection of packaged commodities under the{' '}
            <span className="text-zinc-200 font-medium">
              Legal Metrology (Packaged Commodities) Rules, 2011
            </span>
            . Deterministic USP verification, Big-8 mandate extraction, and verbatim gazette citations.
          </p>
        </div>

        {/* Feature Badges / Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-zinc-200 leading-none">Deterministic</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Zero-LLM Math</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="font-semibold text-zinc-200 leading-none">Big-8 Mandates</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Physical Layout</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-zinc-200 leading-none">Gazette RAG</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Strict Citations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="font-semibold text-zinc-200 leading-none">Enforcement</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Rule 32 Notice</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
