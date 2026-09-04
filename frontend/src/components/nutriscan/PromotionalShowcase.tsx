import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { StaggeredText } from '../ui/staggered-text';
import { Product3DVisual, ProductType } from './Product3DVisual';

interface MinimalProduct {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  score: string;
  bgGradient: string;
  borderColor: string;
  presetId: string;
  type: ProductType;
  accentColor: string;
  specs: string[];
}

const PROMO_PRODUCTS: MinimalProduct[] = [
  {
    id: 'protein-pure',
    name: 'Pure Whey Isolate 100%',
    tagline: '25g Protein • Zero Added Sugar',
    badge: 'PROTEIN POWDER BOX',
    badgeColor: 'bg-[#D5FF3F] text-zinc-950',
    score: 'A+',
    bgGradient: 'from-zinc-900 via-zinc-900 to-black',
    borderColor: 'border-zinc-700/80',
    presetId: 'compliant-biscuit',
    type: 'protein',
    accentColor: '#D5FF3F',
    specs: ['100% Isolate', '0g Cane Sugar', '₹0.38/g USP Verified'],
  },
  {
    id: 'chia-elixir',
    name: 'Sparkling Botanical Cola',
    tagline: 'Zero Aspartame • Real Citrus Fizz',
    badge: 'COLD DRINK BOTTLE',
    badgeColor: 'bg-[#26E1E8] text-zinc-950',
    score: 'B+',
    bgGradient: 'from-cyan-950 via-cyan-900 to-black',
    borderColor: 'border-cyan-800/80',
    presetId: 'violating-face-cream',
    type: 'soda',
    accentColor: '#26E1E8',
    specs: ['No High-Fructose Syrup', 'Natural Stevia', 'Rule 6(1) Compliant'],
  },
  {
    id: 'almond-crisps',
    name: 'Oven Baked Crunch Chips',
    tagline: 'Whole Grain Spelt • Himalayan Salt',
    badge: 'SNACKS & CRISPS',
    badgeColor: 'bg-[#F59E0B] text-black',
    score: 'A',
    bgGradient: 'from-orange-950 via-amber-900 to-black',
    borderColor: 'border-amber-800/80',
    presetId: 'compliant-biscuit',
    type: 'chips',
    accentColor: '#F59E0B',
    specs: ['Whole Grain', 'No Palm Oil', 'Statutory MRP Declaration'],
  },
  {
    id: 'matcha-latte',
    name: 'Artisanal Swiss Dark 70%',
    tagline: 'Single Origin Ghana Cacao Butter',
    badge: 'JUNK FOOD / SWEETS',
    badgeColor: 'bg-[#FF2A85] text-white',
    score: 'C',
    bgGradient: 'from-purple-950 via-indigo-950 to-black',
    borderColor: 'border-purple-800/80',
    presetId: 'imported-chocolate',
    type: 'candy',
    accentColor: '#FF2A85',
    specs: ['High Sugar Flag', 'Missing Importer', 'Rule 32 Violation'],
  },
];

interface PromotionalShowcaseProps {
  onInspectProduct: (presetId: string) => void;
}

export const PromotionalShowcase: React.FC<PromotionalShowcaseProps> = ({
  onInspectProduct,
}) => {
  return (
    <section className="pt-4 pb-2">
      {/* Promotional Banner Box with Warm Aesthetic */}
      <div className="bg-gradient-to-br from-white via-white to-[#F9F7F0] rounded-[28px] p-4 sm:p-7 border border-zinc-200/90 shadow-sm relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D5FF3F]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#FF2A85]/10 blur-3xl pointer-events-none" />

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1118] text-[#D5FF3F] text-[10px] font-black tracking-wider uppercase mb-3 shadow-sm">
          <Sparkles className="w-3 h-3 text-[#D5FF3F]" />
          <span>NutriScan Truth Engine</span>
        </div>

        {/* Staggered Text Revelations */}
        <div className="space-y-1.5 mb-5">
          {/* Main Headline Staggered Reveal */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            <StaggeredText
              text="Scan your product to know the truth."
              as="span"
              segmentBy="words"
              delay={0.07}
              duration={0.5}
              direction="top"
              blur={true}
              className="text-zinc-950 block"
            />
          </h2>

          {/* Subheading Staggered Line */}
          <p className="text-xs sm:text-sm font-semibold text-zinc-600 max-w-xl leading-relaxed">
            <StaggeredText
              text="Detect deceptive label claims, hidden high fructose corn syrup, and illegal Unit Sale Price (USP) mismatches in seconds."
              as="span"
              segmentBy="words"
              delay={0.04}
              duration={0.4}
              direction="bottom"
              blur={true}
              className="text-zinc-600 block"
            />
          </p>

          {/* Secondary Promotional Line */}
          <p className="text-[11px] font-mono text-[#FF2A85] font-bold">
            <StaggeredText
              text="100% Document-Grounded in Official Indian Gazette Metrology Rules (2024 Amendments)."
              as="span"
              segmentBy="words"
              delay={0.05}
              duration={0.35}
              direction="left"
              blur={false}
              className="text-[#FF2A85]"
            />
          </p>
        </div>

        {/* Minimal Looking Product Images / Showcase Cards with 3D Models */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400 font-sans">
              Tactile 3D Specimen Showcase
            </span>
            <span className="text-[11px] font-medium text-zinc-500 hidden sm:inline">
              Tap any item to audit packaging &amp; nutrition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PROMO_PRODUCTS.map((product) => (
              <div
                key={product.id}
                onClick={() => onInspectProduct(product.presetId)}
                className={`bg-gradient-to-b ${product.bgGradient} rounded-2xl p-3.5 border ${product.borderColor} shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-[230px] group relative overflow-hidden active:scale-[0.98]`}
              >
                {/* Top Badge & Grade */}
                <div className="flex items-center justify-between relative z-20">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm ${product.badgeColor}`}
                  >
                    {product.badge}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-black text-xs text-white flex items-center justify-center">
                    {product.score}
                  </span>
                </div>

                {/* 3D Minimal Packaging Model Display */}
                <div className="my-auto py-1 flex items-center justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="scale-75 sm:scale-80 origin-center">
                    <Product3DVisual
                      type={product.type}
                      accentColor={product.accentColor}
                    />
                  </div>
                </div>

                {/* Bottom Product Info */}
                <div className="relative z-20 pt-1 border-t border-white/10">
                  <h4 className="font-black text-xs text-white leading-snug truncate">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">
                    {product.tagline}
                  </p>
                </div>

                {/* Hover Quick Inspect Indicator */}
                <div className="absolute inset-x-0 bottom-0 py-1.5 bg-[#D5FF3F] text-zinc-950 text-[10px] font-black text-center translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-1 z-30">
                  <Eye className="w-3 h-3 text-zinc-950 stroke-[2.5]" />
                  <span>Inspect Label</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
