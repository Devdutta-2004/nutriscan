import React from 'react';

export type ProductType = 'protein' | 'soda' | 'chips' | 'candy' | 'biscuit';

interface Product3DVisualProps {
  type: ProductType;
  accentColor: string;
}

export const Product3DVisual: React.FC<Product3DVisualProps> = ({ type, accentColor }) => {
  switch (type) {
    case 'protein':
      // High-Fidelity 3D Protein Powder Tub / Box
      return (
        <div className="relative w-28 h-36 flex flex-col items-center justify-end select-none filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.45)]">
          {/* Jar Lid with ribbed texture and bevel */}
          <div className="w-20 h-5 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-900 rounded-t-lg border-t border-white/30 shadow-inner relative z-20">
            <div className="absolute inset-x-2 top-1 h-0.5 bg-white/40 rounded-full" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40" />
          </div>

          {/* Jar Neck */}
          <div className="w-18 h-2 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-950 z-10" />

          {/* Main Tub Body (Matte finish with cylindrical highlight) */}
          <div className="w-24 h-28 bg-gradient-to-r from-zinc-900 via-zinc-800 via-40% to-zinc-950 rounded-b-2xl border-x border-b border-white/10 relative overflow-hidden flex flex-col justify-between p-2">
            {/* Cylindrical shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent w-full pointer-events-none" />

            {/* Label wrap */}
            <div className="w-full bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-y border-[#D5FF3F]/40 py-1.5 px-1 rounded relative z-10 text-center shadow-md">
              <span className="text-[6px] tracking-widest text-[#D5FF3F] uppercase font-black block">
                100% ISOLATE
              </span>
              <p className="text-[9px] font-black text-white tracking-tight leading-none">
                WHEY PRO
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[6px] bg-[#D5FF3F] text-black font-black px-1 rounded-xs">
                  25g PROTEIN
                </span>
                <span className="text-[5.5px] text-zinc-300 font-mono">0g SUGAR</span>
              </div>
            </div>

            {/* Bottom Net Weight */}
            <div className="relative z-10 flex items-center justify-between text-[6px] font-mono text-zinc-400 px-0.5">
              <span>NET: 1.0 kg</span>
              <span className="text-[#D5FF3F]">★ 98% SCORE</span>
            </div>
          </div>
        </div>
      );

    case 'soda':
      // 3D Cold Drink / Energy Soda Bottle
      return (
        <div className="relative w-24 h-38 flex flex-col items-center justify-end select-none filter drop-shadow-[0_15px_20px_rgba(6,182,212,0.4)]">
          {/* Bottle Cap with ridges */}
          <div className="w-6 h-3 bg-gradient-to-r from-[#06B6D4] via-[#22D3EE] to-[#0891B2] rounded-t-sm border border-white/40 shadow-sm relative z-20" />
          
          {/* Bottle Neck with translucent gradient */}
          <div className="w-5 h-5 bg-gradient-to-r from-cyan-900/90 via-cyan-500/80 to-cyan-950/90 rounded-t-md z-10 relative">
            <div className="absolute left-1 top-0 bottom-0 w-1 bg-white/50 rounded-full blur-[0.5px]" />
          </div>

          {/* Bottle Shoulder Taper */}
          <div className="w-16 h-7 bg-gradient-to-r from-cyan-950 via-cyan-600/90 to-cyan-950 rounded-t-3xl border-t border-white/30 relative overflow-hidden">
            <div className="absolute left-3 inset-y-0 w-1.5 bg-white/40 blur-[1px]" />
          </div>

          {/* Bottle Body */}
          <div className="w-16 h-22 bg-gradient-to-r from-cyan-950 via-cyan-700 to-cyan-950 rounded-b-xl border-x border-b border-cyan-300/30 relative overflow-hidden flex flex-col justify-between p-1.5">
            {/* Vertical glass reflection */}
            <div className="absolute left-2.5 inset-y-0 w-1.5 bg-white/40 blur-[0.5px]" />
            <div className="absolute right-2 inset-y-0 w-1 bg-cyan-200/20" />

            {/* Soda Brand Label */}
            <div className="w-full bg-[#0E1118]/90 backdrop-blur-sm border border-cyan-400/50 rounded-md p-1 text-center my-auto shadow-sm">
              <span className="text-[5.5px] tracking-widest text-[#26E1E8] uppercase font-black block">
                SPARKLING
              </span>
              <p className="text-[9px] font-black text-white italic tracking-tighter leading-none">
                BOLT ZERO
              </p>
              <span className="text-[5.5px] bg-[#FF2A85] text-white px-1 py-0.2 rounded-full font-bold block mt-0.5">
                NO CORN SYRUP
              </span>
            </div>

            {/* Bottom Volume */}
            <div className="flex items-center justify-between text-[6px] font-mono text-cyan-200 px-0.5">
              <span>330 ml</span>
              <span className="text-[#26E1E8]">₹40.00</span>
            </div>
          </div>
        </div>
      );

    case 'chips':
      // 3D Puffed Snack Foil Bag
      return (
        <div className="relative w-28 h-36 flex flex-col items-center justify-center select-none filter drop-shadow-[0_15px_22px_rgba(239,68,68,0.4)]">
          {/* Top Crimped Seal */}
          <div className="w-22 h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 border-b border-black/30 rounded-t-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />
          </div>

          {/* Pillowed Foil Body with realistic highlights */}
          <div className="w-24 h-28 bg-gradient-to-br from-rose-600 via-orange-500 to-red-700 rounded-2xl shadow-inner border border-rose-300/40 relative overflow-hidden flex flex-col justify-between p-2 transform rotate-1">
            {/* Metallic foil glare sheen */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/25 to-transparent transform rotate-45 pointer-events-none" />

            {/* Chips Brand Mark */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[6.5px] bg-yellow-300 text-black font-black px-1 py-0.5 rounded-sm shadow-xs">
                CRUNCH
              </span>
              <span className="text-[6px] text-white/90 font-bold">BAKED</span>
            </div>

            {/* Center Graphic */}
            <div className="relative z-10 text-center my-auto">
              <p className="text-[10px] font-black text-white uppercase tracking-tight drop-shadow-sm leading-tight">
                NACHO CHIPS
              </p>
              <p className="text-[6px] text-yellow-200 font-semibold">
                Sea Salt &amp; Jalapeño
              </p>
            </div>

            {/* Bottom Stats */}
            <div className="relative z-10 flex items-center justify-between text-[6px] font-mono text-white/90 bg-black/20 backdrop-blur-xs px-1 py-0.5 rounded">
              <span>75 g</span>
              <span className="text-yellow-300 font-bold">NO PALM OIL</span>
            </div>
          </div>

          {/* Bottom Crimped Seal */}
          <div className="w-22 h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 border-t border-black/30 rounded-b-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />
          </div>
        </div>
      );

    case 'candy':
      // 3D Junk Food / Chocolate Bar Pack
      return (
        <div className="relative w-28 h-36 flex flex-col items-center justify-center select-none filter drop-shadow-[0_15px_22px_rgba(139,92,246,0.4)]">
          {/* Chocolate Packaging Foil with Fold */}
          <div className="w-22 h-32 bg-gradient-to-br from-purple-900 via-[#8B5CF6] to-indigo-950 rounded-xl border border-purple-300/30 p-2 flex flex-col justify-between relative overflow-hidden">
            {/* Gold foil exposed top */}
            <div className="absolute -top-1 inset-x-2 h-4 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 rounded-b-md shadow-xs border-b border-amber-500/50" />

            {/* Header */}
            <div className="pt-2 flex items-center justify-between relative z-10">
              <span className="text-[6px] bg-amber-400 text-black font-black px-1 rounded-xs">
                70% CACAO
              </span>
              <span className="text-[6px] text-purple-200 font-bold">SWISS</span>
            </div>

            {/* Center Product Name */}
            <div className="text-center relative z-10 my-auto">
              <p className="text-[11px] font-black text-white tracking-widest uppercase drop-shadow-sm">
                NOIR
              </p>
              <span className="text-[6px] text-amber-200 tracking-wider font-mono">
                ARTISANAL BAR
              </span>
            </div>

            {/* Statutory Compliance Footer */}
            <div className="relative z-10 flex items-center justify-between text-[6px] font-mono text-purple-200 border-t border-white/20 pt-1">
              <span>100 g</span>
              <span className="text-[#D5FF3F]">USP: ₹3.50/g</span>
            </div>
          </div>
        </div>
      );

    case 'biscuit':
    default:
      // 3D Biscuit Roll / Pack
      return (
        <div className="relative w-28 h-36 flex flex-col items-center justify-center select-none filter drop-shadow-[0_15px_22px_rgba(234,88,12,0.4)]">
          {/* Cylindrical Biscuit Roll */}
          <div className="w-24 h-30 bg-gradient-to-r from-amber-800 via-amber-600 via-40% to-amber-900 rounded-2xl border border-amber-400/40 p-2 flex flex-col justify-between relative overflow-hidden shadow-inner">
            {/* Light reflection band */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[6px] bg-[#D5FF3F] text-black font-black px-1 rounded">
                WHOLE WHEAT
              </span>
              <span className="text-[6px] text-amber-100 font-bold">FIBER+</span>
            </div>

            <div className="text-center relative z-10 my-auto">
              <p className="text-[10px] font-black text-white tracking-tight uppercase leading-tight">
                DIGESTIVE
              </p>
              <p className="text-[6px] text-amber-200 font-medium">Original Crisp</p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[6px] font-mono text-amber-100 bg-black/30 px-1 py-0.5 rounded">
              <span>400 g</span>
              <span className="text-emerald-300 font-bold">100% LMPC</span>
            </div>
          </div>
        </div>
      );
  }
};
