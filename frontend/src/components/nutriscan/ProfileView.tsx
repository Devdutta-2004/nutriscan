import React, { useState } from 'react';
import { User, Shield, Sliders, Bell, Award, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

interface ProfileViewProps {
  onOpenNotice: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenNotice }) => {
  const [preferences, setPreferences] = useState({
    lowSugar: true,
    organicOnly: false,
    glutenFree: true,
    legalMetrologyAuditor: true,
  });

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 pt-2 pb-24">
      {/* User Card */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-sm flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
          alt="Priya"
          className="w-16 h-16 rounded-full object-cover ring-4 ring-[#D5FF3F]"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-black text-zinc-900 tracking-tight">Priya Sharma</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-zinc-500 font-medium">priya.sharma@example.com</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#D5FF3F] text-zinc-950 font-black text-[10px] uppercase tracking-wider">
            Verified Inspector
          </span>
        </div>
      </div>

      {/* Dietary & Audit Preferences */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-zinc-900">
          Inspection &amp; Health Filters
        </h3>

        {/* Low Sugar */}
        <div
          onClick={() => togglePref('lowSugar')}
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
        >
          <div>
            <p className="text-xs font-bold text-zinc-800">Strict Low Sugar Warnings</p>
            <p className="text-[11px] text-zinc-500">Flag items exceeding 10% daily sugar</p>
          </div>
          <div
            className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${
              preferences.lowSugar ? 'bg-[#FF2A85]' : 'bg-zinc-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                preferences.lowSugar ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Gluten-Free */}
        <div
          onClick={() => togglePref('glutenFree')}
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
        >
          <div>
            <p className="text-xs font-bold text-zinc-800">Gluten-Free Declaration Check</p>
            <p className="text-[11px] text-zinc-500">Cross-reference allergen disclosures</p>
          </div>
          <div
            className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${
              preferences.glutenFree ? 'bg-[#D5FF3F]' : 'bg-zinc-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-zinc-900 transition-transform ${
                preferences.glutenFree ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Legal Metrology Auditor Mode */}
        <div
          onClick={() => togglePref('legalMetrologyAuditor')}
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
        >
          <div>
            <p className="text-xs font-bold text-zinc-800">LMPC Officer Enforcement Mode</p>
            <p className="text-[11px] text-zinc-500">Generate Rule 32 notices on infractions</p>
          </div>
          <div
            className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${
              preferences.legalMetrologyAuditor ? 'bg-[#26E1E8]' : 'bg-zinc-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-zinc-900 transition-transform ${
                preferences.legalMetrologyAuditor ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Enforcement Notices Shortcut */}
      <button
        onClick={onOpenNotice}
        className="w-full bg-[#0E1118] text-white p-4 rounded-2xl shadow-md flex items-center justify-between hover:bg-black transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-[#D5FF3F]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-extrabold text-sm text-white">Notice of Non-Compliance</p>
            <p className="text-[11px] text-zinc-400">View current Rule 32 Legal Metrology order</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400" />
      </button>
    </div>
  );
};
