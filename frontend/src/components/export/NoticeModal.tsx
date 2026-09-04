import React from 'react';
import { X, Printer, Download, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { NoticeGenerator } from '../../services/pdfExport';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport | null;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    NoticeGenerator.printNotice(report);
  };

  const isCompliant = report.summary.violations_count === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/80">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                isCompliant
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                {isCompliant
                  ? 'Official Certificate of Statutory Compliance'
                  : 'Official Notice of Non-Compliance (Rule 32)'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Legal Metrology Division • Audit ID: {report.audit_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-zinc-200 text-sm space-y-6 font-sans">
          {/* Official Letterhead */}
          <div className="text-center border-b border-zinc-800 pb-5 space-y-1">
            <p className="font-extrabold tracking-widest text-zinc-400 uppercase text-xs">
              GOVERNMENT OF INDIA
            </p>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              Ministry of Consumer Affairs, Food & Public Distribution
            </h2>
            <p className="text-xs text-zinc-400">
              Department of Consumer Affairs • Legal Metrology Division
            </p>
            <p className="text-[11px] font-mono text-emerald-400">
              Enforcement of Legal Metrology (Packaged Commodities) Rules, 2011 &amp; G.S.R. 784(E) 2024
            </p>
          </div>

          {/* Inspection Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px] uppercase">Inspection ID</span>
              <span className="font-mono font-bold text-zinc-200">{report.audit_id}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px] uppercase">Inspection Timestamp</span>
              <span className="font-mono text-zinc-200">
                {new Date(report.audit_timestamp).toLocaleDateString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px] uppercase">Compliance Index</span>
              <span
                className={`font-mono font-bold ${
                  report.compliance_score >= 90
                    ? 'text-emerald-400'
                    : report.compliance_score >= 70
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {report.compliance_score}% / 100%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px] uppercase">Statutory Finding</span>
              <span
                className={`font-bold ${isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {report.legal_status}
              </span>
            </div>
          </div>

          {/* Commodity Details */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.08] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium">Inspected Commodity:</span>
              <span className="font-semibold text-white">{report.product_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium">Enforcement Officer Directive:</span>
              <span className="text-zinc-300">{report.status_text}</span>
            </div>
          </div>

          {/* Findings Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3">Mandate</th>
                  <th className="p-3">Rule Provision</th>
                  <th className="p-3">Declared Text</th>
                  <th className="p-3">Audit Finding</th>
                  <th className="p-3">Penalty Provision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {report.checklist.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      item.status === 'VIOLATION'
                        ? 'bg-rose-950/20'
                        : item.status === 'WARNING'
                        ? 'bg-amber-950/20'
                        : 'bg-zinc-950/40'
                    }
                  >
                    <td className="p-3 font-semibold text-white">{item.name}</td>
                    <td className="p-3 font-mono text-zinc-400">{item.rule}</td>
                    <td className="p-3 font-mono text-zinc-300 max-w-[160px] truncate">
                      {item.extracted_text || 'None'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          item.status === 'COMPLIANT'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-zinc-400 text-[10.5px]">
                      {item.gazette_citation?.penalty_rule || 'Rule 32'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deterministic USP Mathematical Proof */}
          {report.usp_verification.calculated && (
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 font-mono text-xs space-y-1.5">
              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                Deterministic USP Mathematical Proof
              </p>
              <p className="text-zinc-300">
                Formula: {report.usp_verification.calculated.formula}
              </p>
              <p className="text-zinc-300">
                Statutory Required USP: {report.usp_verification.calculated.expected_display}
              </p>
              <p className="text-zinc-300">
                Printed on Label: {report.usp_verification.printed || 'NOT DECLARED'}
              </p>
              <p
                className={`font-semibold ${
                  report.usp_verification.is_valid ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                Finding: {report.usp_verification.reason}
              </p>
            </div>
          )}

          {/* Legal Directives */}
          {!isCompliant && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-rose-300 uppercase tracking-wider text-[11px]">
                <ShieldAlert className="w-4 h-4" />
                Statutory Show-Cause Directive under Rule 32 of LMPC Rules, 2011
              </h4>
              <p>
                The manufacturer/packer/importer is hereby directed to show cause within fifteen (15)
                days from receipt hereof as to why prosecution or compounding under Section 36/39 of
                the Legal Metrology Act, 2009 should not be initiated. Distribution of non-compliant
                lots must cease immediately.
              </p>
            </div>
          )}

          {/* Digital Signature & Barcode */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div>
              <p className="font-mono text-[11px] text-emerald-400">
                Digital Verification Hash: SHA256-{report.audit_id.slice(-8)}
              </p>
              <p>Automated Legal Metrology Regulatory Portal • FairPack Engine</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">Inspecting Officer / Metrology Division</p>
              <p className="text-[11px]">Authorized Enforcement Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
