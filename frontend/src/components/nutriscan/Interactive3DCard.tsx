import React, { useState, useEffect, useRef } from 'react';
import { Box, Zap, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Product3DVisual, ProductType } from './Product3DVisual';

interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  type: ProductType;
  gradient: string;
  accentColor: string;
  presetId: string;
  complianceScore: string;
  category: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'protein-powder',
    name: 'WHEY ISOLATE 100%',
    subtitle: 'High Protein Muscle Tub (1kg)',
    badge: 'CLEAN FUEL',
    type: 'protein',
    gradient: 'from-[#0E1118] via-[#1F2937] to-[#111827]',
    accentColor: '#D5FF3F',
    presetId: 'compliant-biscuit',
    complianceScore: '98%',
    category: 'Protein Powder Box',
  },
  {
    id: 'cold-soda',
    name: 'BOLT ZERO SODA',
    subtitle: 'Cold Drink Sparkling Can (330ml)',
    badge: 'ZERO SUGAR',
    type: 'soda',
    gradient: 'from-[#06B6D4] via-[#0284C7] to-[#0369A1]',
    accentColor: '#26E1E8',
    presetId: 'violating-face-cream',
    complianceScore: '75%',
    category: 'Cold Drink Bottle',
  },
  {
    id: 'snack-chips',
    name: 'NACHO JALAPEÑO',
    subtitle: 'Baked Crisps Pouch (75g)',
    badge: 'NO PALM OIL',
    type: 'chips',
    gradient: 'from-[#EA580C] via-[#DC2626] to-[#991B1B]',
    accentColor: '#F59E0B',
    presetId: 'compliant-biscuit',
    complianceScore: '94%',
    category: 'Snacks & Crisps',
  },
  {
    id: 'junk-chocolate',
    name: 'SWISS DARK NOIR',
    subtitle: '70% Cocoa Artisanal Bar (100g)',
    badge: 'HIGH SUGAR',
    type: 'candy',
    gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]',
    accentColor: '#FF2A85',
    presetId: 'imported-chocolate',
    complianceScore: '62%',
    category: 'Junk Food / Confectionery',
  },
  {
    id: 'digestive-biscuits',
    name: 'WHOLE WHEAT BISCUIT',
    subtitle: 'Fiber Rich Digestive (400g)',
    badge: '100% LMPC',
    type: 'biscuit',
    gradient: 'from-[#B45309] via-[#92400E] to-[#78350F]',
    accentColor: '#D5FF3F',
    presetId: 'compliant-biscuit',
    complianceScore: '100%',
    category: 'Packaged Food Items',
  },
];

interface Interactive3DCardProps {
  onExploreProduct?: (presetId: string) => void;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({ onExploreProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState({ x: 8, y: -12 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const dragStart = useRef({ x: 0, y: 0 });

  const activeProduct = PRODUCTS[currentIndex];

  // Auto-cycle products with time every 3.8 seconds when not actively dragging
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setRotation({
      x: Math.max(-25, Math.min(25, rotation.x - deltaY * 0.35)),
      y: Math.max(-35, Math.min(35, rotation.y + deltaX * 0.35)),
    });
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setIsAutoPlaying(false);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStart.current.x;
    const deltaY = e.touches[0].clientY - dragStart.current.y;
    setRotation({
      x: Math.max(-25, Math.min(25, rotation.x - deltaY * 0.35)),
      y: Math.max(-35, Math.min(35, rotation.y + deltaX * 0.35)),
    });
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  return (
    <div className="pt-2">
      {/* Outer Neon Lime Frame */}
      <div className="bg-[#D5FF3F] p-2 sm:p-2.5 rounded-[28px] border-2 border-zinc-900 shadow-md">
        {/* Inner Black Card */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onClick={() => onExploreProduct?.(activeProduct.presetId)}
          className="bg-[#0E1118] rounded-[22px] p-4 sm:p-5 h-[280px] sm:h-[310px] lg:h-[330px] relative overflow-hidden flex flex-col justify-between cursor-grab active:cursor-grabbing select-none transition-all"
          style={{ perspective: '1100px' }}
        >
          {/* Subtle Ambient Radial Glow matching active product */}
          <div 
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-30 blur-2xl pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeProduct.accentColor }}
          />

          {/* Top Pill Controls */}
          <div className="flex items-center justify-between z-20">
            <div className="px-2.5 py-1 rounded-full bg-zinc-800/90 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D5FF3F] animate-ping" />
              <span>3D MODEL • {activeProduct.category.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-1">
              {/* Play/Pause Autocycle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                title={isAutoPlaying ? "Pause Auto-Switch" : "Resume Auto-Switch"}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  isAutoPlaying ? 'bg-[#D5FF3F] text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <button
                onClick={handlePrev}
                className="w-6 h-6 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="w-6 h-6 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="Next product"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="w-6 h-6 rounded-lg bg-zinc-800/90 flex items-center justify-center text-zinc-300 ml-1">
                <Box className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Product Info Left Side */}
          <div className="z-20 max-w-[55%] space-y-1 my-auto">
            <span 
              className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase shadow-xs mb-1"
              style={{ backgroundColor: activeProduct.accentColor, color: '#000000' }}
            >
              {activeProduct.badge}
            </span>
            <h3 className="text-white font-black text-base sm:text-xl lg:text-2xl tracking-tight leading-tight drop-shadow-md">
              {activeProduct.name}
            </h3>
            <p className="text-zinc-400 text-[11px] sm:text-xs font-medium line-clamp-2">
              {activeProduct.subtitle}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-white/90 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700">
                Score: {activeProduct.complianceScore}
              </span>
              <span className="text-[10px] text-[#D5FF3F] font-bold">
                Tap to inspect →
              </span>
            </div>
          </div>

          {/* 3D Floating Interactive Model Image Container (Right Side) */}
          <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-6 flex items-center justify-center pointer-events-none z-10">
            <div
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.08)`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }}
              className="pointer-events-auto cursor-pointer filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] hover:scale-115 transition-transform"
            >
              <Product3DVisual
                type={activeProduct.type}
                accentColor={activeProduct.accentColor}
              />
            </div>
          </div>

          {/* Bottom Progress Indicator Bar & Dots */}
          <div className="z-20 flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              {PRODUCTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all pointer-events-auto ${
                    idx === currentIndex
                      ? 'w-5 bg-[#D5FF3F]'
                      : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Select product ${p.name}`}
                />
              ))}
            </div>

            <span className="text-[9px] font-mono text-zinc-400">
              {currentIndex + 1} of {PRODUCTS.length}
            </span>
          </div>
        </div>

        {/* Footer Subtext on Lime Frame */}
        <div className="pt-2 pb-0.5 px-2 flex items-center justify-between">
          <p className="text-zinc-900 font-black text-xs tracking-tight">
            Tap to explore {activeProduct.name}
          </p>
          <span className="text-[10px] font-mono text-zinc-800 bg-black/10 px-2 py-0.5 rounded-full font-bold">
            Interactive 3D
          </span>
        </div>
      </div>
    </div>
  );
};
