import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Sparkles, RefreshCw, Zap, CheckCircle2, UploadCloud } from 'lucide-react';
import { AuditReport } from '../../types/compliance';
import { RECENT_ITEMS, ScannedItem } from './RecentlyScanned';

interface LiveScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (presetId: string) => void;
  onFileUpload: (file: File) => void;
}

export const LiveScannerModal: React.FC<LiveScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  onFileUpload,
}) => {
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('compliant-biscuit');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera if user chooses
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && useRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setUseRealCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, useRealCamera]);

  if (!isOpen) return null;

  const handleSimulateScan = (presetId: string) => {
    setIsAnalyzing(true);
    setSelectedPreset(presetId);
    setTimeout(() => {
      setIsAnalyzing(false);
      onScanComplete(presetId);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0E1118] border border-white/15 rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D5FF3F] text-zinc-950 flex items-center justify-center shadow-[0_0_15px_rgba(213,255,63,0.4)]">
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                Live Label &amp; Barcode Scanner
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                AI Layout OCR &amp; Statutory Compliance Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder Screen */}
        <div className="relative w-full h-[280px] sm:h-[340px] bg-black flex items-center justify-center overflow-hidden">
          {useRealCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* Synthetic High-Tech Packaging Viewfinder */
            <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
              <img
                src={
                  selectedPreset === 'compliant-biscuit'
                    ? '/presets/compliant_biscuit.svg'
                    : selectedPreset === 'violating-face-cream'
                    ? '/presets/violating_face_cream.svg'
                    : '/presets/imported_chocolate.svg'
                }
                alt="Scanning Specimen"
                className="w-full h-full object-contain p-4 opacity-75"
              />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(#D5FF3F 1px, transparent 1px), linear-gradient(90deg, #D5FF3F 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
            </div>
          )}

          {/* Animated Scanning Laser Line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D5FF3F] to-transparent shadow-[0_0_20px_#D5FF3F] animate-[bounce_2s_infinite]" />

          {/* Targeting Corner Reticles */}
          <div className="absolute inset-8 sm:inset-12 pointer-events-none border-2 border-dashed border-[#D5FF3F]/40 rounded-2xl flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-t-4 border-l-4 border-[#D5FF3F] -mt-1 -ml-1 rounded-tl-lg" />
              <div className="w-6 h-6 border-t-4 border-r-4 border-[#D5FF3F] -mt-1 -mr-1 rounded-tr-lg" />
            </div>
            
            {/* Center Status Badge */}
            <div className="self-center px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D5FF3F]/40 text-[#D5FF3F] text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>EXTRACTING LMPC TOKENS...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 fill-[#D5FF3F]" />
                  <span>ALIGN PACKAGING IN RETICLE</span>
                </>
              )}
            </div>

            <div className="flex justify-between">
              <div className="w-6 h-6 border-b-4 border-l-4 border-[#D5FF3F] -mb-1 -ml-1 rounded-bl-lg" />
              <div className="w-6 h-6 border-b-4 border-r-4 border-[#D5FF3F] -mb-1 -mr-1 rounded-br-lg" />
            </div>
          </div>
        </div>

        {/* Quick Sample Selector Bar */}
        <div className="p-4 bg-zinc-900/80 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Or simulate scanning preset:</span>
            <button
              onClick={() => setUseRealCamera(!useRealCamera)}
              className="text-[11px] text-[#D5FF3F] hover:underline font-mono"
            >
              {useRealCamera ? 'Switch to Virtual Viewfinder' : 'Enable Device Webcam'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulateScan('compliant-biscuit')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-left border border-white/5 hover:border-[#D5FF3F]/40 transition-all text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-[#D5FF3F] mb-1" />
              <p className="font-bold text-white truncate">Multigrain Crackers</p>
              <p className="text-[10px] text-zinc-400 font-mono">100% Pass</p>
            </button>

            <button
              onClick={() => handleSimulateScan('violating-face-cream')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-left border border-white/5 hover:border-[#FF2A85]/40 transition-all text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-[#FF2A85] mb-1" />
              <p className="font-bold text-white truncate">Face Cream</p>
              <p className="text-[10px] text-zinc-400 font-mono">No USP (Rule 6)</p>
            </button>

            <button
              onClick={() => handleSimulateScan('imported-chocolate')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-left border border-white/5 hover:border-[#8B5CF6]/40 transition-all text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mb-1" />
              <p className="font-bold text-white truncate">Swiss Chocolate</p>
              <p className="text-[10px] text-zinc-400 font-mono">Missing Importer</p>
            </button>
          </div>

          {/* Manual File Upload Fallback */}
          <div className="pt-1 flex items-center justify-between">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                  onClose();
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-[#26E1E8]" />
              <span>Upload Custom Label Artwork / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
