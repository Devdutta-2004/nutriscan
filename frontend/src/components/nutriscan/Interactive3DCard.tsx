import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Camera, 
  ArrowRight, ShieldCheck, Sparkles, CheckCircle2 
} from 'lucide-react';

export interface ConsumerStorySlide {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  caption: string;
  subCaption: string;
  bannerUrl: string;
  actionText: string;
  presetId: string;
}

export const CONSUMER_SLIDES: ConsumerStorySlide[] = [
  {
    id: 'story-mother',
    title: 'Smart Grocery Shopping with Complete Confidence',
    badge: '100% Authentic MRP',
    badgeColor: '#D5FF3F',
    caption: 'Verify MRP, Net Quantity & Expiry Date in 1-Click Before You Buy',
    subCaption: 'Empowering families across India to make safe, verified, and cheat-proof grocery purchases.',
    bannerUrl: '/banners/consumer_mother.jpg',
    actionText: 'Scan Grocery Product',
    presetId: 'compliant-biscuit',
  },
  {
    id: 'story-student',
    title: 'Zero Hidden Taxes & Fair Packaged Commodities',
    badge: 'Legal Rights Guaranteed',
    badgeColor: '#38BDF8',
    caption: 'Never pay more than the printed MRP. Instant dual-pricing detection.',
    subCaption: 'Protecting youth and students from inflated airport, multiplex, and roadside overcharging.',
    bannerUrl: '/banners/consumer_student.jpg',
    actionText: 'Check Beverage Label',
    presetId: 'compliant-biscuit',
  },
  {
    id: 'story-family',
    title: 'Transparency in Every Single Gram & Millilitre',
    badge: 'Standard SI Units',
    badgeColor: '#34D399',
    caption: 'Unit Sale Price (USP) ensures you compare real value effortlessly.',
    subCaption: 'Statutory compliance under Legal Metrology Rules, 2011 gives power back to Indian shoppers.',
    bannerUrl: '/banners/consumer_family.jpg',
    actionText: 'Verify Fair Pack',
    presetId: 'imported-chocolate',
  },
  {
    id: 'story-elders',
    title: 'Shop With Peace of Mind & Complete Trust',
    badge: 'Registered Manufacturer',
    badgeColor: '#F59E0B',
    caption: 'Clear manufacturing dates, genuine PIN codes & consumer helpline verification.',
    subCaption: 'Seniors can instantly detect deceptive packaging and expired products with clear audio/visual alerts.',
    bannerUrl: '/banners/consumer_elders.jpg',
    actionText: 'Inspect Health Pack',
    presetId: 'compliant-biscuit',
  },
];

interface Interactive3DCardProps {
  onExploreProduct?: (presetId: string) => void;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({ onExploreProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slide = CONSUMER_SLIDES[currentIndex];

  // Auto-play slide
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CONSUMER_SLIDES.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CONSUMER_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CONSUMER_SLIDES.length) % CONSUMER_SLIDES.length);
  };

  return (
    <div className="w-full">
      {/* Edge-to-Edge Panoramic Banner Container - No Inner Margins */}
      <div className="w-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-zinc-200/80 shadow-xl relative bg-zinc-950 group">
        
        {/* Banner Image - Edge-to-Edge without extra margins */}
        <div className="relative w-full aspect-[16/9] max-h-[500px] overflow-hidden">
          <img
            src={slide.bannerUrl}
            alt={slide.title}
            className="w-full h-full object-cover sm:object-contain bg-zinc-900 transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Top Pill Overlay (Badge & Slide Indicator) */}
          <div className="absolute top-3 sm:top-5 inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none">
            <span
              className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md pointer-events-auto backdrop-blur-md"
              style={{ backgroundColor: slide.badgeColor }}
            >
              {slide.badge}
            </span>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 shadow-md"
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Educational Caption Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 text-left flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                {slide.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 font-semibold drop-shadow-sm">
                {slide.caption}
              </p>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {slide.subCaption}
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onExploreProduct && onExploreProduct(slide.presetId)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#D5FF3F] hover:bg-[#cbf432] active:scale-95 text-zinc-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#D5FF3F]/25"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{slide.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Prev / Next Navigation Arrows on Image */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20 shadow-lg"
            title="Previous story"
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20 shadow-lg"
            title="Next story"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="bg-zinc-950 py-2.5 px-4 flex items-center justify-center gap-2 border-t border-white/10">
          {CONSUMER_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-7 bg-[#D5FF3F]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
