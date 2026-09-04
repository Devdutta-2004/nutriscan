import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, Scale, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MobileQuickBarProps {
  onScanClick: () => void;
  onUploadClick: () => void;
  onQuickPreset: (id: string) => void;
  onOpenNotice?: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onScanClick,
  onUploadClick,
  onQuickPreset,
  onOpenNotice,
}) => {
  return (
    <div className="w-full pt-1 pb-2">
      {/* Horizontal scrolling pill actions */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {/* Instant Scan */}
        <button
          onClick={onScanClick}
          className="flex items-center gap-1.5 shrink-0 bg-[#0E1118] text-[#D5FF3F] px-3.5 py-2 rounded-2xl text-xs font-black shadow-sm active:scale-95 transition-all border border-[#D5FF3F]/30"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Quick Scan</span>
        </button>

        {/* Upload Label */}
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 shrink-0 bg-white text-zinc-900 px-3.5 py-2 rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-all border border-zinc-200 hover:border-zinc-300"
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#FF2A85]" />
          <span>Upload Image</span>
        </button>

        {/* Test Preset 1: Biscuit */}
        <button
          onClick={() => onQuickPreset('preset-1')}
          className="flex items-center gap-1.5 shrink-0 bg-white/90 text-zinc-800 px-3 py-2 rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-all border border-zinc-200"
        >
          <span className="text-xs">🍪</span>
          <span>Biscuits</span>
        </button>

        {/* Test Preset 2: Face Cream */}
        <button
          onClick={() => onQuickPreset('preset-2')}
          className="flex items-center gap-1.5 shrink-0 bg-white/90 text-zinc-800 px-3 py-2 rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-all border border-zinc-200"
        >
          <span className="text-xs">🧴</span>
          <span>Face Cream</span>
        </button>

        {/* Test Preset 3: Swiss Choco */}
        <button
          onClick={() => onQuickPreset('preset-3')}
          className="flex items-center gap-1.5 shrink-0 bg-white/90 text-zinc-800 px-3 py-2 rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-all border border-zinc-200"
        >
          <span className="text-xs">🍫</span>
          <span>Swiss Choco</span>
        </button>

        {/* LMPC Rule 32 Notice */}
        {onOpenNotice && (
          <button
            onClick={onOpenNotice}
            className="flex items-center gap-1.5 shrink-0 bg-[#FF2A85]/10 text-[#FF2A85] px-3 py-2 rounded-2xl text-xs font-black shadow-sm active:scale-95 transition-all border border-[#FF2A85]/30"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF2A85]" />
            <span>Rule 32 Notice</span>
          </button>
        )}
      </div>
    </div>
  );
};
