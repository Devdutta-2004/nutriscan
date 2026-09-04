import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, ChevronDown, BookOpen, Search, Eye } from 'lucide-react';
import { ChecklistItem, ComplianceStatus } from '../../types/compliance';
import { getPlainEnglishSummary } from '../../utils/grading';

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
  const [filter, setFilter] = useState<'ALL' | 'VIOLATION' | 'WARNING' | 'COMPLIANT'>('ALL');
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  const violationsCount = checklist.filter((c) => c.status === 'VIOLATION').length;
  const warningsCount = checklist.filter((c) => c.status === 'WARNING').length;
  const compliantCount = checklist.filter((c) => c.status === 'COMPLIANT').length;

  const filteredItems = checklist.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            PASS
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3" />
            ADVISORY
          </span>
        );
      case 'VIOLATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <XCircle className="w-3 h-3" />
            VIOLATION
          </span>
        );
    }
  };

  const toggleCitation = (e: React.MouseEvent, mandateId: string) => {
    e.stopPropagation();
    setExpandedCitationId((prev) => (prev === mandateId ? null : mandateId));
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-zinc-200">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
            Statutory Mandates Audit ({checklist.length})
          </h3>
          <p className="text-xs text-zinc-500">
            Every mandatory declaration verified under the Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'ALL' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All ({checklist.length})
          </button>
          {violationsCount > 0 && (
            <button
              onClick={() => setFilter('VIOLATION')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'VIOLATION'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Violations ({violationsCount})
            </button>
          )}
          {warningsCount > 0 && (
            <button
              onClick={() => setFilter('WARNING')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'WARNING'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Advisories ({warningsCount})
            </button>
          )}
          <button
            onClick={() => setFilter('COMPLIANT')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'COMPLIANT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Pass ({compliantCount})
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isSelected = selectedMandateId === item.mandate_id;
          const isCitationOpen = expandedCitationId === item.mandate_id;
          const isViolation = item.status === 'VIOLATION';
          const isWarning = item.status === 'WARNING';
          const plainSummary = getPlainEnglishSummary(item);

          return (
            <div
              key={item.mandate_id}
              onClick={() => onSelectMandate(item.mandate_id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-zinc-900 shadow-md ring-2 ring-zinc-900/10'
                  : isViolation
                  ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/70'
                  : isWarning
                  ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {/* Card Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-zinc-900">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {item.rule}
                    </span>
                  </div>

                  {/* Plain English Finding */}
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    {plainSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Extracted Value on Packaging */}
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Detected on Label:
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-[11px] font-semibold truncate max-w-[280px]">
                    {item.extracted_text || '[NOT FOUND ON PACKAGING]'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Spotlight on Label Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMandate(item.mandate_id);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Spotlight
                  </button>

                  {/* Expand Gazette Law Button */}
                  <button
                    onClick={(e) => toggleCitation(e, item.mandate_id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{isCitationOpen ? 'Hide Gazette Law' : 'View Gazette Law'}</span>
                    {isCitationOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Gazette Legal Citation Accordion */}
              {isCitationOpen && item.gazette_citation && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-zinc-700 space-y-2 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-indigo-900">
                      Official Gazette Citation: {item.gazette_citation.gazette_ref || 'LMPC Rules 2011'}
                    </span>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded">
                      {item.gazette_citation.rule || item.rule}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-800 italic bg-white p-2.5 rounded-lg border border-indigo-100/60 leading-relaxed font-serif">
                    "{item.gazette_citation.verbatim_clause || item.gazette_citation.verbatim_text}"
                  </p>

                  {item.gazette_citation.officer_guidance && (
                    <div className="text-[11px] text-zinc-600">
                      <strong className="text-zinc-800">Officer Enforcement Directive: </strong>
                      {item.gazette_citation.officer_guidance}
                    </div>
                  )}

                  <div className="pt-1 border-t border-indigo-100 flex items-center justify-between text-[11px] font-semibold text-indigo-900">
                    <span>Applicable Statutory Penalty:</span>
                    <span className="font-bold text-rose-700">
                      {typeof item.gazette_citation.penalty_rule === 'object'
                        ? item.gazette_citation.penalty_rule?.title || item.gazette_citation.penalty_rule?.id || 'Rule 32'
                        : item.gazette_citation.penalty_rule || 'Rule 32 (Fine up to ₹25,000)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
