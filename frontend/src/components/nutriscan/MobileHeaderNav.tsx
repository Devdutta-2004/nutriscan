import React, { useState } from 'react';
import { Leaf, Camera, Image as ImageIcon, Sparkles, Menu, X, Bell, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface MobileHeaderNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onScanClick: () => void;
  onUploadClick: () => void;
  onOpenNotice?: () => void;
  onProfileClick: () => void;
}

export const MobileHeaderNav: React.FC<MobileHeaderNavProps> = ({
  activeTab,
  onSelectTab,
  onScanClick,
  onUploadClick,
  onOpenNotice,
  onProfileClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAction = (cb: () => void) => {
    setIsMenuOpen(false);
    cb();
  };

  return (
    <div className="relative z-30">
      {/* Mobile Top Navigation Bar */}
      <div className="flex items-center justify-between py-2.5 px-1 border-b border-zinc-200/70 sm:border-none">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#0E1118] flex items-center justify-center shadow-md shrink-0">
            <Leaf className="w-4.5 h-4.5 text-[#D5FF3F] fill-[#D5FF3F]" />
          </div>
          <div className="flex items-center text-lg font-black tracking-tight text-[#0E1118]">
            <span>Nutri</span>
            <span className="text-[#FF2A85]">Scan</span>
          </div>
          <span className="bg-[#D5FF3F] text-zinc-950 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ml-1">
            PWA
          </span>
        </div>

        {/* Action icons right */}
        <div className="flex items-center gap-2">
          {/* Quick Scan Action button on mobile header */}
          <button
            onClick={onScanClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1118] text-[#D5FF3F] text-xs font-black shadow-sm active:scale-95 transition-transform"
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Scan</span>
          </button>

          {/* Quick Menu Toggle for extra features */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isMenuOpen ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-800 shadow-sm'
            }`}
            aria-label="Toggle Features Menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* User Avatar */}
          <button
            onClick={onProfileClick}
            className="relative rounded-full ring-2 ring-zinc-900/80 p-0.5 overflow-hidden active:scale-95 transition-transform shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
              alt="Priya Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Feature Dropdown Drawer for Mobile */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-2xl border border-zinc-200 shadow-xl rounded-2xl p-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider px-2 pt-1">
            Instant Features &amp; Tools
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleAction(onScanClick)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0E1118] text-white text-left font-bold text-xs hover:bg-black transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-[#D5FF3F] text-zinc-950 flex items-center justify-center shrink-0">
                <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-white font-extrabold text-xs">Live Scanner</p>
                <p className="text-[9px] text-[#D5FF3F]">Instant OCR</p>
              </div>
            </button>

            <button
              onClick={() => handleAction(onUploadClick)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-left font-bold text-xs hover:bg-zinc-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FF2A85]/10 text-[#FF2A85] flex items-center justify-center shrink-0">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-zinc-900 font-extrabold text-xs">Upload Photo</p>
                <p className="text-[9px] text-zinc-500">Auditing pipeline</p>
              </div>
            </button>
          </div>

          <div className="space-y-1 pt-1 border-t border-zinc-100">
            <button
              onClick={() => handleAction(() => onSelectTab('insights'))}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF2A85]" />
                <span className="text-xs font-bold text-zinc-800">Big-8 Nutritional Intelligence</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => handleAction(() => onSelectTab('category'))}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#26E1E8]" />
                <span className="text-xs font-bold text-zinc-800">Category Comparison &amp; Safety</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {onOpenNotice && (
              <button
                onClick={() => handleAction(onOpenNotice)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-red-50/60 hover:bg-red-50 transition-colors text-left text-red-600 font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  <span>LMPC Non-Compliance Notice (Rule 32)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-red-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
