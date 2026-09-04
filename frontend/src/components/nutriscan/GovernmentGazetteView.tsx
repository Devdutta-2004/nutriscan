import React, { useState, useMemo } from 'react';
import { 
  Scale, BookOpen, ShieldCheck, FileText, ExternalLink, Search, 
  Filter, CheckCircle2, AlertTriangle, Download, Printer, Award,
  Landmark, ArrowRight, ShieldAlert, Sparkles, ChevronDown, ChevronUp, Copy, Check,
  Languages
} from 'lucide-react';
import { STATUTORY_RULES, StatutoryRule } from '../../data/gazetteRules';
import { HINDI_STATUTORY_MAP } from '../../data/hindiRulesMap';
import { AshokaEmblem, JagoGrahakJagoLogo } from '../common/GovtEmblems';

interface GovernmentGazetteViewProps {
  onBackToHome?: () => void;
  onOpenNotice?: () => void;
}

export const GovernmentGazetteView: React.FC<GovernmentGazetteViewProps> = ({
  onBackToHome,
  onOpenNotice,
}) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>('rule_6_1_a');
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);

  // Filter rules
  const filteredRules = useMemo(() => {
    return STATUTORY_RULES.filter((rule) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (rule.category && rule.category.toLowerCase() === selectedCategory.toLowerCase()) ||
        (selectedCategory === 'declaration' && rule.id.startsWith('rule_6_1')) ||
        (selectedCategory === 'penalty' && (rule.id.startsWith('rule_32') || rule.id.startsWith('section_')));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.title.toLowerCase().includes(q) ||
        rule.verbatim_text.toLowerCase().includes(q) ||
        rule.gazette_ref.toLowerCase().includes(q) ||
        rule.officer_guidance.toLowerCase().includes(q) ||
        (rule.tags && rule.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyText = (rule: StatutoryRule) => {
    navigator.clipboard.writeText(`${rule.title}\nGazette Ref: ${rule.gazette_ref}\n${rule.verbatim_text}`);
    setCopiedRuleId(rule.id);
    setTimeout(() => setCopiedRuleId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* 1. Official Government Header & Statutory Guarantee Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Landmark className="w-72 h-72 text-zinc-900" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Government of India Crest Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-3.5">
              <AshokaEmblem size={38} />
              <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase font-mono">
                  GOVERNMENT OF INDIA • भारत सरकार
                </p>
                <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-tight">
                  Ministry of Consumer Affairs, Food &amp; Public Distribution
                </h2>
                <p className="text-xs font-semibold text-zinc-500">
                  Department of Consumer Affairs • Legal Metrology Division
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <JagoGrahakJagoLogo size={32} />
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory Enforceability Guarantee</span>
              </span>
            </div>
          </div>

          {/* Legal Authority Affirmation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white space-y-3 shadow-md border border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D5FF3F] text-zinc-950 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(213,255,63,0.3)]">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  Official Legal Guarantee of Rules &amp; Mathematical Admissibility
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Every automated statutory audit performed by NutriScan is strictly grounded in the official gazettes of India published under the authority of the <strong>Legal Metrology Act, 2009 (Act No. 1 of 2010)</strong> and the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> (G.S.R. 202(E) as amended by G.S.R. 779(E) &amp; G.S.R. 784(E)).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-zinc-400 block uppercase">Governing Act</span>
                <span className="font-bold text-zinc-200">Act 1 of 2010</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-zinc-400 block uppercase">Primary Rules</span>
                <span className="font-bold text-zinc-200">LMPC Rules, 2011</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-zinc-400 block uppercase">Latest Amendment</span>
                <span className="font-bold text-emerald-400">G.S.R. 784(E) 2024</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-zinc-400 block uppercase">SIH Problem Code</span>
                <span className="font-bold text-[#D5FF3F]">SIH26034</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Gazette Legislative Acts & Notifications Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">
              Primary Statutory Instruments &amp; Gazette Orders
            </h3>
            <p className="text-xs text-zinc-500">
              The 5 cornerstone government documents guaranteeing the rules applied in every inspection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Doc 1 */}
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm hover:border-zinc-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold border border-indigo-200">
                  G.S.R. 202(E) • 07.03.2011
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-black text-sm sm:text-base text-zinc-900 leading-snug">
                Legal Metrology (Packaged Commodities) Rules, 2011
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                The foundational statutory regulation for pre-packed goods sold across India. Establishes Chapter II Rule 6 (Mandatory declarations), Rule 7 &amp; 8 (Principal Display Panel dimensions and minimum numeral font height Table-I), and Rule 32 penalties.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500 text-[11px]">Department of Consumer Affairs</span>
              <a
                href="https://consumeraffairs.nic.in/acts-and-rules/legal-metrology/the-legal-metrology-packaged-commodities-rules-2011"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Doc 2 */}
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm hover:border-zinc-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-mono font-bold border border-purple-200">
                  G.S.R. 779(E) &amp; G.S.R. 226(E)
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <h4 className="font-black text-sm sm:text-base text-zinc-900 leading-snug">
                Unit Sale Price (USP) Statutory Mandate (Rule 6(1)(s) &amp; 6(11))
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Enacted by the Central Government, effective 1st October 2022. Mandates that all packaged commodities declare price per unit (per g, kg, ml, L, or number) to empower consumer price comparison and prevent concealed shrinkflation.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500 text-[11px]">Enforced 1st Oct 2022</span>
              <a
                href="https://egazette.gov.in"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <span>Gazette Copy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Doc 3 */}
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm hover:border-zinc-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                  G.S.R. 784(E) • Latest 2024
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-black text-sm sm:text-base text-zinc-900 leading-snug">
                2024 Packaged Commodities Amendment Rules (G.S.R. 784(E))
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Latest reform prohibiting misleading qualifying terms (e.g. 'approx', 'average', 'when packed') on packaging, enforcing clear metric SI units, and extending mandatory declarations to e-commerce and multi-panel digital displays.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500 text-[11px]">Active Statutory Standard</span>
              <a
                href="https://consumeraffairs.nic.in"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Verify Gazette</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Doc 4 */}
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm hover:border-zinc-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-mono font-bold border border-rose-200">
                  Act 1 of 2010 &amp; Act 18 of 2023
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <h4 className="font-black text-sm sm:text-base text-zinc-900 leading-snug">
                Legal Metrology Act, 2009 &amp; Jan Vishwas Reform 2023
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Parliamentary statute providing inspection, seizure, and penalty powers under Section 15 (Powers of inspection and seizure), Section 36(1) (Penalty for non-standard package), Section 36(2) (Short quantity error), and Jan Vishwas compounding framework.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500 text-[11px]">Enacted by Parliament</span>
              <a
                href="https://indiacode.nic.in/handle/123456789/2056"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <span>India Code Registry</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Official Gazette Credentials & 7 Statutory Schedules Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-3xl p-5 sm:p-6 text-white border border-zinc-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#D5FF3F] text-zinc-950 text-[10px] font-black font-mono uppercase">
                  OFFICIAL GAZETTE OF INDIA • भारत का राजपत्र
                </span>
                <span className="text-[11px] font-mono text-zinc-400">REGD. NO. D. L.-33004/99</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white mt-1">
                Notification G.S.R. 202(E) / सा.का.नि. 202(अ) • File [F. No. WM-9(6)/2010-Pt.]
              </h4>
              <p className="text-xs text-zinc-400">
                Ministry of Consumer Affairs, Food &amp; Public Distribution • Signed by Rakesh Kacker, Special Secretary
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] font-mono text-emerald-400 font-bold block">Enforced 1st April 2011</span>
              <span className="text-[10px] text-zinc-500 font-mono">Part II—Sec. 3(i) No. 124</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
              7 Statutory Schedules &amp; Enforcement Inspection Forms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[10px] text-[#D5FF3F] font-bold block">FIRST SCHEDULE (Rule 2(e))</span>
                <p className="font-bold text-zinc-200">Maximum Permissible Error (MPE)</p>
                <p className="text-[11px] text-zinc-400">Table I (Weight/Volume: 9% to 1%) &amp; Table II (Length/Area: 2% to 4%)</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[10px] text-[#D5FF3F] font-bold block">SECOND SCHEDULE (Rule 5)</span>
                <p className="font-bold text-zinc-200">Standard Pack Sizes</p>
                <p className="text-[11px] text-zinc-400">Prescribed quantities for biscuits, bread, tea, coffee, edible oils, soaps</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[10px] text-[#D5FF3F] font-bold block">THIRD SCHEDULE (Rule 11(4))</span>
                <p className="font-bold text-zinc-200">"When Packed" Qualifier</p>
                <p className="text-[11px] text-zinc-400">Permitted only for commodities subject to moisture variation: soaps, lotions, creams</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[10px] text-[#D5FF3F] font-bold block">FOURTH SCHEDULE (Rule 12(2))</span>
                <p className="font-bold text-zinc-200">Exceptions: Weight / Volume</p>
                <p className="text-[11px] text-zinc-400">Table of 26 items sold by mass or volume (curd, sauces, aerosol, cables)</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[10px] text-[#D5FF3F] font-bold block">FIFTH SCHEDULE (Rule 19)</span>
                <p className="font-bold text-zinc-200">Statistical Sample Sizes</p>
                <p className="text-[11px] text-zinc-400">Lot &lt; 4000: 32 samples • Lot &gt; 4000: 80 samples drawn across 8 points of stock</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[10px] text-[#D5FF3F] font-bold block">SIXTH &amp; SEVENTH SCHEDULE</span>
                <p className="font-bold text-zinc-200">Form A &amp; Form B Inspection Sheets</p>
                <p className="text-[11px] text-zinc-400">Official Legal Metrology Officer Data Sheets for net quantity and tare verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consumer Affairs Official Live Repository Directory */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-sm font-black text-zinc-900 tracking-tight">
                  Department of Consumer Affairs • Live Official Document Directory
                </h4>
              </div>
              <p className="text-xs text-zinc-500">
                Direct verified publications from <a href="https://consumeraffairs.gov.in/pages/legal-metrology-act" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">consumeraffairs.gov.in/pages/legal-metrology-act</a>
              </p>
            </div>
            <a
              href="https://consumeraffairs.gov.in/pages/legal-metrology-act"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 flex items-center gap-1.5 w-fit"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <a
              href="http://consumeraffairs.gov.in/public/upload/files/8_1732871406.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-zinc-50 hover:bg-indigo-50/60 border border-zinc-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono">
                  G.S.R. 202(E) Base Rules
                </span>
                <p className="font-extrabold text-zinc-900 group-hover:text-indigo-900">
                  The Legal Metrology (Packaged Commodities) Rules, 2011
                </p>
                <p className="text-[11px] text-zinc-500 font-hindi">
                  विधिक माप विज्ञान (पैकेज में रखी वस्तुएं) नियम, 2011
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-indigo-600 font-bold pt-1 border-t border-zinc-200/50">
                <span>43 Pages • PDF</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="http://consumeraffairs.gov.in/public/upload/files/Jan%20Vishwas%20(Amendment%20of%20Provisions)%20Act,%202023%20(18%20of%202023)_1732708241.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-zinc-50 hover:bg-rose-50/60 border border-zinc-200 hover:border-rose-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                  Act 18 of 2023
                </span>
                <p className="font-extrabold text-zinc-900 group-hover:text-rose-900">
                  Jan Vishwas (Amendment of Provisions) Act, 2023
                </p>
                <p className="text-[11px] text-zinc-500 font-hindi">
                  जन विश्वास (उपबंधों का संशोधन) अधिनियम, 2023
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-rose-600 font-bold pt-1 border-t border-zinc-200/50">
                <span>Penalty Decriminalization</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="https://consumeraffairs.gov.in/public/upload/files/230946_1732871433.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-zinc-50 hover:bg-purple-50/60 border border-zinc-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">
                  G.S.R. 779(E) USP Mandate
                </span>
                <p className="font-extrabold text-zinc-900 group-hover:text-purple-900">
                  Unit Sale Price (USP) Statutory Amendment Rules, 2021
                </p>
                <p className="text-[11px] text-zinc-500 font-hindi">
                  इकाई विक्रय मूल्य (यूएसपी) अनिवार्य नियम
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-purple-600 font-bold pt-1 border-t border-zinc-200/50">
                <span>Rule 6(1)(s) &amp; 6(11)</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="http://consumeraffairs.gov.in/public/upload/files/8(xii)_0_1732871346.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-zinc-50 hover:bg-amber-50/60 border border-zinc-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                  G.S.R. 629(E) Dual MRP Ban
                </span>
                <p className="font-extrabold text-zinc-900 group-hover:text-amber-900">
                  Dual MRP Ban &amp; Table-I Font Heights Amendment, 2017
                </p>
                <p className="text-[11px] text-zinc-500 font-hindi">
                  दोहरी एमआरपी का पूर्ण प्रतिषेध
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-700 font-bold pt-1 border-t border-zinc-200/50">
                <span>Rule 18(2A) &amp; E-Commerce</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="http://consumeraffairs.gov.in/public/upload/files/Notification%20-%20%20Legal%20Metrology%20(QR%20Code)_1732871487.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-zinc-50 hover:bg-emerald-50/60 border border-zinc-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  G.S.R. 524(E) QR Code
                </span>
                <p className="font-extrabold text-zinc-900 group-hover:text-emerald-900">
                  Electronics QR Code Declarations Amendment Rules, 2022
                </p>
                <p className="text-[11px] text-zinc-500 font-hindi">
                  इलेक्ट्रॉनिक उत्पादों पर क्यूआर कोड का उपयोग
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold pt-1 border-t border-zinc-200/50">
                <span>Digital Declarations</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="https://consumeraffairs.gov.in/public/upload/files/2026.02.13%20PCR%201st%20COO%20Filter%20on%20e-commerce%20websites_1771231030.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-zinc-50 hover:bg-blue-50/60 border border-zinc-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">
                  Latest 2026 Reform
                </span>
                <p className="font-extrabold text-zinc-900 group-hover:text-blue-900">
                  Country of Origin (COO) Filter on E-Commerce Platforms, 2026
                </p>
                <p className="text-[11px] text-zinc-500 font-hindi">
                  ई-कॉमर्स पर मूल देश फिल्टर अनिवार्यता
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-blue-700 font-bold pt-1 border-t border-zinc-200/50">
                <span>E-Commerce Rules</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Interactive Gazette Rules & Verbatim Text Explorer */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-zinc-900 tracking-tight">
                {language === 'hi' ? 'इंटरएक्टिव राजपत्र विधिक भंडार' : 'Interactive Gazette Statutory Repository'} ({filteredRules.length} Clauses)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold font-mono">
                {language === 'hi' ? 'सा.का.नि. 202(अ)' : 'G.S.R. 202(E)'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'hi'
                ? 'मूल हिंदी राजपत्र के अधिकृत प्रावधान, अधिकारी प्रवर्तन निर्देश और दंड संहिता'
                : 'Browse verbatim official gazette language, officer enforcement interpretations, and penalty provisions'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Toggle Pill */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#0E1118] text-[#D5FF3F] shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  language === 'hi'
                    ? 'bg-[#0E1118] text-[#D5FF3F] shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span>हिन्दी</span>
                <span className="text-[9px] px-1 rounded bg-[#D5FF3F]/30 text-zinc-950 font-bold">अ</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'खोजें (जैसे: यूएसपी, एमआरपी, पिन)...' : 'Search rule (e.g., USP, PIN, MRP)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D5FF3F] focus:border-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी विधिक नियम' : 'All Statutory Rules' },
            { id: 'declaration', label: language === 'hi' ? 'अनिवार्य घोषणाएं (नियम 6)' : 'Mandatory Declarations (Rule 6)' },
            { id: 'quantity', label: language === 'hi' ? 'शुद्ध मात्रा एवं मात्रक' : 'Net Quantity & Units' },
            { id: 'typography', label: language === 'hi' ? 'पैनल (PDP) एवं अक्षर ऊंचाई' : 'Display Panel (PDP) & Fonts' },
            { id: 'pricing', label: language === 'hi' ? 'मूल्य एवं दोहरी एमआरपी' : 'Pricing & Dual MRP' },
            { id: 'penalty', label: language === 'hi' ? 'शास्ति एवं विधिक दंड' : 'Penalties & Legal Sanctions' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0E1118] text-[#D5FF3F] shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rules Accordion List */}
        <div className="space-y-3">
          {filteredRules.map((rule) => {
            const isExpanded = expandedRuleId === rule.id;
            const isCopied = copiedRuleId === rule.id;
            const hindiEntry = HINDI_STATUTORY_MAP[rule.id];
            const displayTitle = language === 'hi' && hindiEntry ? hindiEntry.title_hindi : rule.title;
            const displayVerbatim = language === 'hi' && hindiEntry ? hindiEntry.verbatim_hindi : rule.verbatim_text;

            return (
              <div
                key={rule.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded ? 'bg-zinc-50/70 border-zinc-300 shadow-sm' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {/* Rule Accordion Bar */}
                <div
                  onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                  className="p-4 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 font-mono text-xs font-bold border border-zinc-200">
                      §
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 truncate">
                          {displayTitle}
                        </h4>
                        {language === 'hi' && hindiEntry && (
                          <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 text-[9px] font-bold">
                            हिन्दी पाठ
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono text-[10px] font-bold">
                          {rule.gazette_ref}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-medium truncate mt-0.5">
                        {rule.act_rule}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyText(rule);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition-colors"
                      title="Copy verbatim legal citation"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <div className="p-1 rounded-lg text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Verbatim Gazette View */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 space-y-3.5 border-t border-zinc-200/80 text-xs">
                    
                    {/* Verbatim Gazette Text */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 font-mono">
                          {language === 'hi' ? 'राजपत्र का अधिकृत मूल पाठ (Verbatim Gazette Clause)' : 'Official Gazette Verbatim Clause'}
                        </span>
                        {language === 'hi' && hindiEntry && (
                          <span className="text-[10px] text-orange-700 font-semibold">
                            अधिसूचना सा.का.नि. 202(अ) से प्रमाणित
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 font-serif leading-relaxed text-xs italic shadow-inner">
                        "{displayVerbatim}"
                      </div>
                    </div>

                    {/* Officer Enforcement Directive */}
                    {rule.officer_guidance && (
                      <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 space-y-1">
                        <strong className="text-[11px] font-extrabold block text-indigo-900">
                          {language === 'hi' ? 'विधिक माप विज्ञान प्रवर्तन निर्देश (Inspection Directive):' : 'Legal Metrology Enforcement Directive:'}
                        </strong>
                        <p className="text-xs text-indigo-900 leading-relaxed">
                          {rule.officer_guidance}
                        </p>
                      </div>
                    )}

                    {/* Meta Row: Penalty & Effective Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-200/60 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200/60 text-rose-900">
                        <span className="font-semibold text-[11px]">
                          {language === 'hi' ? 'लागू शास्ति एवं दंड:' : 'Penalty Provision:'}
                        </span>
                        <span className="font-bold font-mono text-[11px]">
                          {typeof rule.penalty_rule === 'object'
                            ? (rule.penalty_rule as any)?.title || 'Rule 32'
                            : rule.penalty_rule || 'Rule 32 (₹25,000)'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-100 text-zinc-700 font-mono text-[11px]">
                        <span>Effective Date:</span>
                        <span className="font-bold">{rule.effective_date || '2011-04-01'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Official Notice Generation Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
            Need to Issue a Statutory Improvement Notice?
          </h4>
          <p className="text-xs text-zinc-400">
            Generate an official Government Form Notice under Rule 32 / Section 36 for any audited specimen
          </p>
        </div>

        <button
          onClick={onOpenNotice}
          className="px-5 py-2.5 rounded-2xl bg-[#D5FF3F] hover:bg-[#cbf432] text-zinc-950 font-black text-xs transition-all active:scale-95 flex items-center gap-2 shadow-md shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Open Rule 32 Notice Form</span>
        </button>
      </div>
    </div>
  );
};
