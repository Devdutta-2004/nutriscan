import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, ShieldCheck, 
  AlertTriangle, Sparkles, CheckCircle2, ArrowRight, Tag, Scale, Eye, FileText
} from 'lucide-react';
import { ProductPackagingVisual, PackagingType } from './ProductPackagingVisual';

export interface ProductShowcaseItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  packType: PackagingType;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  complianceScore: number;
  verdict: 'Lawful for Retail Sale' | 'Conditional / Advisory' | 'Non-Compliant (Notice Warranted)';
  gradient: string;
  accentColor: string;
  presetId: string;
  labelValues: {
    genericName: string;
    netQty: string;
    mrp: string;
    usp: string;
    mfgDate: string;
    consumerCare: string;
    address: string;
    pinCode: string;
    countryOfOrigin?: string;
  };
  highlights: string[];
}

export const SHOWCASE_PRODUCTS: ProductShowcaseItem[] = [
  {
    id: 'digestive-biscuits',
    name: 'Digestive Whole Wheat Biscuits',
    subtitle: 'High-Fibre Atta Tea Pack (400g Standard Size)',
    category: 'Packaged Food • Biscuits (Second Schedule)',
    packType: 'biscuit',
    grade: 'A+',
    complianceScore: 98,
    verdict: 'Lawful for Retail Sale',
    gradient: 'from-amber-950 via-zinc-900 to-black',
    accentColor: '#D5FF3F',
    presetId: 'compliant-biscuit',
    labelValues: {
      genericName: 'Digestive Whole Wheat Biscuits',
      netQty: '400 g (SI Metric Compliant)',
      mrp: '₹80.00 (Incl. of all taxes)',
      usp: '₹0.20 per gram (Rule 6(1)(s))',
      mfgDate: '03/2024 (Format MM/YYYY Valid)',
      consumerCare: '1800-22-1011 • care@parle.biz',
      address: 'Parle Biscuits Pvt Ltd, North Level, Vile Parle',
      pinCode: 'PIN 400057 (Rule 10 Verified)',
    },
    highlights: [
      'Second Schedule Standard Pack Size (400g)',
      'Accurate Unit Sale Price (USP) calculation',
      'Clear 1x and 2x numeral clearance spacing',
      'Dual consumer contact (Helpline Phone & Email)'
    ]
  },
  {
    id: 'swiss-chocolate',
    name: 'Swiss Dark Noir Chocolate Bar',
    subtitle: '70% Cocoa Single Origin Artisanal Slab (100g)',
    category: 'Imported Confectionery • Packaged Foods',
    packType: 'chocolate',
    grade: 'A',
    complianceScore: 92,
    verdict: 'Lawful for Retail Sale',
    gradient: 'from-purple-950 via-zinc-900 to-black',
    accentColor: '#C084FC',
    presetId: 'imported-chocolate',
    labelValues: {
      genericName: 'Dark Chocolate Confectionery',
      netQty: '100 g',
      mrp: '₹240.00 (Incl. of all taxes)',
      usp: '₹2.40 per gram',
      mfgDate: '01/2024',
      consumerCare: '+91 22 6677 8899 • help@indoswiss.in',
      address: 'Swiss Chocolatier SA, Zurich / Imp: Indo-Swiss Ltd, Mumbai',
      pinCode: 'PIN 400001 (Importer Registered)',
      countryOfOrigin: 'Switzerland (Rule 6(1)(g) Satisfied)',
    },
    highlights: [
      'Mandatory Country of Origin clearly displayed on PDP',
      'Indian Importer complete postal address with PIN',
      'Single unified MRP declaration (No dual pricing)',
      'Bilingual English & French supplementary typography'
    ]
  },
  {
    id: 'derma-cream',
    name: 'Derma Glow Night Repair Cream',
    subtitle: 'Intensive Hydration Peptide Emulsion (50g)',
    category: 'Cosmetics & Personal Care • Jar Pack',
    packType: 'cosmetic',
    grade: 'C',
    complianceScore: 58,
    verdict: 'Non-Compliant (Notice Warranted)',
    gradient: 'from-rose-950 via-zinc-900 to-black',
    accentColor: '#FF2A85',
    presetId: 'violating-face-cream',
    labelValues: {
      genericName: 'Cosmetic Skin Repair Cream',
      netQty: '50 g (Net Weight)',
      mrp: '₹499.00 (Taxes Extra - VIOLATION)',
      usp: 'Not Declared (VIOLATION of Rule 6(1)(s))',
      mfgDate: '10/2023 • Best Before: 12/2025',
      consumerCare: 'Phone missing • Only email provided',
      address: 'Glow Cosmetics Ltd, Sector 62, Noida',
      pinCode: 'PIN missing (Advisory Rule 10)',
    },
    highlights: [
      'CRITICAL: "Taxes extra" violates Rule 6(1)(e) & Rule 2(m)',
      'VIOLATION: Unit Sale Price (USP) omitted entirely',
      'DEFECT: Consumer telephone helpline missing',
      'Improvement Notice under Section 36(1) triggered'
    ]
  },
  {
    id: 'bolt-soda',
    name: 'Bolt Sparkling Citrus Soda',
    subtitle: 'Zero Sugar Carbonated Soft Drink (330ml Can)',
    category: 'Beverages • Aerated Soft Drinks (Second Schedule)',
    packType: 'soda',
    grade: 'A+',
    complianceScore: 96,
    verdict: 'Lawful for Retail Sale',
    gradient: 'from-cyan-950 via-zinc-900 to-black',
    accentColor: '#26E1E8',
    presetId: 'compliant-biscuit',
    labelValues: {
      genericName: 'Carbonated Lemon-Lime Water',
      netQty: '330 ml (Standard Can Schedule II)',
      mrp: '₹40.00 (Incl. of all taxes)',
      usp: '₹0.121 per ml',
      mfgDate: '05/2026',
      consumerCare: '1800-11-2658 • care@boltsoda.in',
      address: 'Bolt Beverages India Pvt Ltd, Industrial Area, Pune',
      pinCode: 'PIN 411019',
    },
    highlights: [
      'Second Schedule 330ml can standard volume conformity',
      'Table-I 2.0mm numeral font height compliance',
      'Explicit MRP printed on can crown/rim',
      'Mandatory green vegetarian declaration emblem'
    ]
  },
  {
    id: 'whey-protein',
    name: 'Pure Whey Isolate 100%',
    subtitle: 'Ultra-Filtered Whey Protein Tub (1.0 kg)',
    category: 'Health & Nutrition • Powder Tub',
    packType: 'protein',
    grade: 'A+',
    complianceScore: 99,
    verdict: 'Lawful for Retail Sale',
    gradient: 'from-zinc-950 via-zinc-900 to-black',
    accentColor: '#D5FF3F',
    presetId: 'compliant-biscuit',
    labelValues: {
      genericName: 'Whey Protein Dietary Supplement Powder',
      netQty: '1.0 kg (1000 g)',
      mrp: '₹3,299.00 (Incl. of all taxes)',
      usp: '₹3.30 per gram',
      mfgDate: '08/2026 • Exp: 08/2028',
      consumerCare: '1800-20-4499 • support@cleanfuel.in',
      address: 'Clean Fuel Nutrition Ltd, Plot 42, Baddi',
      pinCode: 'PIN 173205',
    },
    highlights: [
      'QR Code for digital secondary declarations (G.S.R. 524(E))',
      'Exact USP calculation matches formula (₹3299 ÷ 1000g)',
      'Clear FSSAI & Legal Metrology registration markings',
      'Exemplary 99% overall statutory audit index'
    ]
  }
];

interface Interactive3DCardProps {
  onExploreProduct?: (presetId: string) => void;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({ onExploreProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeView, setActiveView] = useState<'visual' | 'label'>('visual');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const product = SHOWCASE_PRODUCTS[currentIndex];

  // Auto slide
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_PRODUCTS.length) % SHOWCASE_PRODUCTS.length);
  };

  return (
    <div className="w-full space-y-3">
      {/* Full-Width Panoramic Product Inspection Showcase Container */}
      <div
        className={`w-full rounded-[36px] bg-gradient-to-br ${product.gradient} border border-zinc-800 text-white p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden transition-all duration-500`}
      >
        {/* Subtle Ambient Light Glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: product.accentColor }}
        />

        {/* Top Meta Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm"
              style={{
                backgroundColor: product.accentColor,
                color: '#09090B',
              }}
            >
              {product.category}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Specimen {currentIndex + 1} of {SHOWCASE_PRODUCTS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Visual vs Detailed Label Board */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveView('visual')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeView === 'visual'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Packaging View
              </button>
              <button
                type="button"
                onClick={() => setActiveView('label')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeView === 'label'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Tag className="w-3 h-3" />
                <span>Label Values</span>
              </button>
            </div>

            {/* Play/Pause Auto-Slide */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
              title={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Main Content Area (Two Columns on Desktop) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-6 items-center">
          
          {/* Left Side: Visual Packaging Graphic & Quick Stats (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-sm relative group">
              {/* Product Packaging Illustration */}
              <ProductPackagingVisual
                type={product.packType}
                className="transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Dynamic Floating Grade Badge */}
              <div className="absolute top-2 right-2 px-3.5 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-zinc-950"
                  style={{ backgroundColor: product.accentColor }}
                >
                  {product.grade}
                </div>
                <div className="text-left leading-none">
                  <span className="font-mono font-black text-xs text-white block">
                    {product.complianceScore}%
                  </span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase">
                    Audit Score
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory Verdict Pill */}
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 border shadow-xs ${
                product.complianceScore >= 90
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : product.complianceScore >= 70
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              {product.complianceScore >= 90 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>{product.verdict}</span>
            </div>
          </div>

          {/* Right Side: Product Details, Real Label Data, and Highlights (7 Cols on Desktop) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-zinc-300 mt-1">
                {product.subtitle}
              </p>
            </div>

            {/* View 1: Real Packaging Label Values Grid */}
            {activeView === 'label' ? (
              <div className="bg-black/40 rounded-2xl p-4 border border-white/10 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[11px] font-extrabold text-[#D5FF3F] uppercase tracking-wider font-mono">
                    Mandatory Label Values Extracted on Packaging
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Legal Metrology Rules, 2011</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">Generic Name (Rule 6(1)(b)):</span>
                    <span className="font-bold text-zinc-200 truncate block">{product.labelValues.genericName}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">Net Quantity (Rule 6(1)(c)):</span>
                    <span className="font-bold text-zinc-200 truncate block">{product.labelValues.netQty}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">Maximum Retail Price (Rule 6(1)(e)):</span>
                    <span className="font-bold text-zinc-200 truncate block">{product.labelValues.mrp}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">Unit Sale Price - USP (Rule 6(1)(s)):</span>
                    <span className="font-bold text-[#D5FF3F] truncate block">{product.labelValues.usp}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">Date of Packaging (Rule 6(1)(d)):</span>
                    <span className="font-bold text-zinc-200 truncate block">{product.labelValues.mfgDate}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">Manufacturer PIN (Rule 10):</span>
                    <span className="font-bold text-zinc-200 truncate block">{product.labelValues.pinCode}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono">
                  <span className="text-[10px] text-zinc-400 block">Consumer Care Helpline &amp; Email (Rule 6(2)):</span>
                  <span className="text-zinc-200 font-bold">{product.labelValues.consumerCare}</span>
                </div>
              </div>
            ) : (
              /* View 2: Packaging Highlights & Legal Inspection Points */
              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 font-mono">
                  Key Inspection Checkpoints &amp; Statutory Integrity:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 leading-relaxed"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: product.accentColor }}
                      />
                      <span className="text-zinc-200 text-xs font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onExploreProduct && onExploreProduct(product.presetId)}
                className="px-6 py-3 rounded-2xl bg-[#D5FF3F] hover:bg-[#cbf432] text-zinc-950 font-black text-xs transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-[#D5FF3F]/20"
              >
                <Eye className="w-4 h-4" />
                <span>Run Full LMPC Inspection Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs text-zinc-400 font-mono hidden sm:block">
                Preset ID: <span className="text-zinc-200 font-bold">{product.presetId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Carousel Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-2">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {SHOWCASE_PRODUCTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-[#D5FF3F]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to ${p.name}`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/10"
              title="Previous specimen"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/10"
              title="Next specimen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
