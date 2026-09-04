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

          {/* Clean Image View with subtle play/pause control */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 shadow-md"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>
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
