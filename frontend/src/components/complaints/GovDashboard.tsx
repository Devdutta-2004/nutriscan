import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Eye, EyeOff, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, Clock, AlertTriangle, XCircle, Send, ExternalLink,
  Filter, Building2, Flag, Loader2, FileText, Search
} from 'lucide-react';

const API_BASE = '/api';

const STATUS_COLORS: Record<string, string> = {
  'Submitted':    'bg-blue-100 text-blue-700',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  'Forwarded':    'bg-purple-100 text-purple-700',
  'Action Taken': 'bg-orange-100 text-orange-700',
  'Resolved':     'bg-green-100 text-green-700',
  'Closed':       'bg-zinc-100 text-zinc-600',
};

const STATUS_ORDER = ['Submitted', 'Under Review', 'Forwarded', 'Action Taken', 'Resolved', 'Closed'];

const INDIAN_STATES = [
  '', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
  'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 'Other / Central',
];

interface GovDashboardProps {
  onClose: () => void;
}

export const GovDashboard: React.FC<GovDashboardProps> = ({ onClose }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateMap, setUpdateMap] = useState<Record<string, { status: string; notes: string; action: string }>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [forwardingId, setForwardingId] = useState<string | null>(null);
  const [forwardResults, setForwardResults] = useState<Record<string, any>>({});

  const handleLogin = async () => {
    if (!token.trim()) return;
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/complaints/all`, {
        headers: { 'X-Gov-Token': token.trim() },
      });
      if (res.status === 401) {
        setLoginError('Invalid officer token. Please check and try again.');
        return;
      }
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setComplaints(data.complaints ?? []);
      setIsLoggedIn(true);
    } catch {
      setLoginError('Connection error. Please check backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterState) params.set('state', filterState);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`${API_BASE}/complaints/all?${params}`, {
        headers: { 'X-Gov-Token': token.trim() },
      });
      const data = await res.json();
      setComplaints(data.complaints ?? []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId: string) => {
    const update = updateMap[complaintId];
    if (!update?.status) return;
    setUpdatingId(complaintId);
    try {
      await fetch(`${API_BASE}/complaints/${complaintId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Gov-Token': token.trim() },
        body: JSON.stringify({
          status: update.status,
          officer_notes: update.notes || null,
          action_taken: update.action || null,
        }),
      });
      await fetchComplaints();
    } catch {
      alert('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleForward = async (complaintId: string) => {
    setForwardingId(complaintId);
    try {
      const res = await fetch(`${API_BASE}/complaints/${complaintId}/forward`, {
        method: 'POST',
        headers: { 'X-Gov-Token': token.trim() },
      });
      const data = await res.json();
      setForwardResults((prev) => ({ ...prev, [complaintId]: data }));
      await fetchComplaints();
    } catch {
      alert('Forward failed');
    } finally {
      setForwardingId(null);
    }
  };

  const initUpdate = (c: any) => {
    if (!updateMap[c.id]) {
      setUpdateMap((prev) => ({
        ...prev,
        [c.id]: { status: c.status, notes: c.officer_notes || '', action: c.action_taken || '' },
      }));
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.ref_number?.toLowerCase().includes(q) ||
      c.product_name?.toLowerCase().includes(q) ||
      c.consumer_name?.toLowerCase().includes(q) ||
      c.consumer_state?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === 'Submitted').length,
    review: complaints.filter((c) => c.status === 'Under Review').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  // ── Login Screen ──
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#0E1118] p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D5FF3F]/10 border border-[#D5FF3F]/30 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-7 h-7 text-[#D5FF3F]" />
            </div>
            <h2 className="text-white font-black text-lg">Government Officer Portal</h2>
            <p className="text-slate-400 text-xs mt-1">Legal Metrology Department — NutriScan</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black text-zinc-700 mb-1.5">Officer Access Token</label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your officer token"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#D5FF3F]/40 focus:border-zinc-400"
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {loginError}
                </p>
              )}
              <p className="text-[10px] text-zinc-400 mt-1.5">
                Demo token: <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700 font-mono">nutriscan-gov-2025</code>
              </p>
            </div>
            <button
              onClick={handleLogin}
              disabled={!token.trim() || isLoggingIn}
              className="w-full bg-[#0E1118] text-[#D5FF3F] font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-zinc-800 transition-colors active:scale-95"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
            </button>
            <button onClick={onClose} className="w-full text-zinc-400 font-semibold py-1.5 text-sm hover:text-zinc-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#F0EDE3] overflow-hidden">
      {/* Header */}
      <div className="bg-[#0E1118] px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D5FF3F]/10 border border-[#D5FF3F]/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#D5FF3F]" />
          </div>
          <div>
            <h1 className="text-white font-black text-sm">Legal Metrology Officer Dashboard</h1>
            <p className="text-slate-500 text-[10px]">Ministry of Consumer Affairs | NutriScan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchComplaints}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors text-xs font-semibold"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#0B0F17] px-4 sm:px-6 py-3 grid grid-cols-4 gap-3 shrink-0 border-b border-slate-800">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'New', value: stats.submitted, color: 'text-blue-400' },
          { label: 'In Review', value: stats.review, color: 'text-yellow-400' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2 shrink-0">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by ref, product, consumer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-zinc-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>
        <select
          value={filterState}
          onChange={(e) => { setFilterState(e.target.value); }}
          className="border border-zinc-200 rounded-xl px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All States</option>
          {INDIAN_STATES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); }}
          className="border border-zinc-200 rounded-xl px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Statuses</option>
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={fetchComplaints}
          className="flex items-center gap-1 bg-[#0E1118] text-white font-bold px-3 py-2 rounded-xl text-xs hover:bg-zinc-800 transition-colors"
        >
          <Filter className="w-3 h-3" /> Apply
        </button>
      </div>

      {/* Complaint List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        )}

        {!isLoading && filteredComplaints.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <Flag className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm">No complaints found</p>
            <p className="text-xs mt-1">Try refreshing or adjusting filters</p>
          </div>
        )}

        {filteredComplaints.map((c) => {
          const isExpanded = expandedId === c.id;
          const upd = updateMap[c.id] ?? { status: c.status, notes: '', action: '' };
          const fwdResult = forwardResults[c.id];

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              {/* Collapsed card */}
              <button
                className="w-full text-left p-4"
                onClick={() => {
                  setExpandedId(isExpanded ? null : c.id);
                  initUpdate(c);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-xs text-zinc-900 font-mono">{c.ref_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${STATUS_COLORS[c.status] ?? 'bg-zinc-100 text-zinc-500'}`}>
                        {c.status}
                      </span>
                      {c.ingram_forwarded && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 uppercase">
                          INGRAM ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-zinc-800 mt-1 truncate">{c.product_name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Building2 className="w-2.5 h-2.5" /> {c.consumer_state}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-zinc-500">{c.violations?.length ?? 0} violations</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />}
                </div>
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="border-t border-zinc-100 p-4 space-y-4 bg-zinc-50">
                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1">Consumer</p>
                      <p className="font-semibold text-zinc-800">{c.consumer_name}</p>
                      {c.consumer_email && <p className="text-zinc-600">{c.consumer_email}</p>}
                      {c.consumer_phone && <p className="text-zinc-600">{c.consumer_phone}</p>}
                      <p className="text-zinc-600">{c.consumer_district ? `${c.consumer_district}, ` : ''}{c.consumer_state}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1">Purchase</p>
                      <p className="font-semibold text-zinc-800">{c.purchase_location}</p>
                      {c.purchase_date && <p className="text-zinc-600">{c.purchase_date}</p>}
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1">Violations Reported</p>
                      <div className="flex flex-wrap gap-1">
                        {(c.violation_rules ?? []).map((r: string) => (
                          <span key={r} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold">{r}</span>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1">Consumer Description</p>
                      <p className="text-zinc-700 leading-relaxed">{c.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1">Routed To</p>
                      <p className="font-semibold text-zinc-800">{c.routed_to_dept}</p>
                      <p className="text-zinc-600">{c.routed_to_email} · {c.routed_to_phone}</p>
                    </div>
                  </div>

                  {/* Officer Actions */}
                  <div className="bg-white border border-zinc-200 rounded-xl p-3 space-y-3">
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-wider">Officer Actions</p>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">Update Status</label>
                      <select
                        value={upd.status}
                        onChange={(e) => setUpdateMap((prev) => ({ ...prev, [c.id]: { ...upd, status: e.target.value } }))}
                        className="w-full border border-zinc-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-white"
                      >
                        {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">Officer Notes (visible to consumer)</label>
                      <textarea
                        rows={2}
                        value={upd.notes}
                        onChange={(e) => setUpdateMap((prev) => ({ ...prev, [c.id]: { ...upd, notes: e.target.value } }))}
                        placeholder="Add notes for consumer..."
                        className="w-full border border-zinc-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">Action Taken</label>
                      <input
                        type="text"
                        value={upd.action}
                        onChange={(e) => setUpdateMap((prev) => ({ ...prev, [c.id]: { ...upd, action: e.target.value } }))}
                        placeholder="e.g., Penalty notice issued under Rule 32..."
                        className="w-full border border-zinc-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(c.id)}
                        disabled={updatingId === c.id}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#0E1118] text-white font-black py-2 rounded-xl text-xs hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      >
                        {updatingId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                        Save Update
                      </button>
                      <button
                        onClick={() => handleForward(c.id)}
                        disabled={forwardingId === c.id || c.ingram_forwarded}
                        title={c.ingram_forwarded ? 'Already forwarded to INGRAM' : 'Forward to INGRAM / NCH Portal'}
                        className="flex items-center gap-1.5 bg-purple-600 text-white font-black py-2 px-3 rounded-xl text-xs hover:bg-purple-700 transition-colors disabled:opacity-40"
                      >
                        {forwardingId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        {c.ingram_forwarded ? 'Forwarded ✓' : 'Forward to INGRAM'}
                      </button>
                    </div>
                  </div>

                  {/* INGRAM forward result */}
                  {fwdResult && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-black text-purple-800">INGRAM Forward Result</p>
                      <p className="text-[10px] text-purple-700">{fwdResult.note}</p>
                      <a
                        href={fwdResult.ingram_prefill_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] font-bold text-purple-700 hover:text-purple-900"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open INGRAM Portal with Pre-filled Data
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
