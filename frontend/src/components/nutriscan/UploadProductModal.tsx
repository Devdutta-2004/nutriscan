import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, Loader2, ArrowRight, RefreshCw, FileText, Camera } from 'lucide-react';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (file: File, previewUrl: string) => void;
}

export const UploadProductModal: React.FC<UploadProductModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRunAudit = () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setProgressPercent(20);
    setProcessingStage('Ingesting image & deskewing...');

    setTimeout(() => {
      setProgressPercent(50);
      setProcessingStage('Layout-Aware OCR Token Extraction...');
      setTimeout(() => {
        setProgressPercent(85);
        setProcessingStage('Deterministic USP & Big-8 LMPC Audit...');
        setTimeout(() => {
          setProgressPercent(100);
          setProcessingStage('Document-Grounded Gazette Citations Linked!');
          setTimeout(() => {
            setIsProcessing(false);
            onUploadSuccess(selectedFile, previewUrl);
            onClose();
            // Reset modal state
            setSelectedFile(null);
            setPreviewUrl(null);
            setProgressPercent(0);
          }, 350);
        }, 500);
      }, 500);
    }, 450);
  };

  const handleUseSample = async (svgPath: string, fileName: string) => {
    try {
      const res = await fetch(svgPath);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: 'image/svg+xml' });
      handleFile(file);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#F7F5EC] border border-zinc-300 rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-zinc-900">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200/80 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0E1118] text-[#D5FF3F] flex items-center justify-center shadow-md">
              <UploadCloud className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 leading-tight">
                Upload Packaging Image
              </h3>
              <p className="text-[11px] font-semibold text-zinc-500">
                AI Layout OCR &amp; Legal Metrology Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {!previewUrl ? (
            /* Empty State: Drag & Drop Dropzone */
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[26px] p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? 'border-zinc-900 bg-[#D5FF3F]/20 scale-[1.01]'
                  : 'border-zinc-300 hover:border-zinc-900 bg-white/80 hover:bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0E1118] text-[#D5FF3F] flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 stroke-[2]" />
              </div>

              <div>
                <p className="font-extrabold text-sm sm:text-base text-zinc-900">
                  Drag and drop packaging artwork here
                </p>
                <p className="text-xs text-zinc-500 mt-1 font-medium">
                  or <span className="text-[#FF2A85] font-bold underline">browse from your device</span>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  PNG
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  JPG
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  WebP
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  PDF
                </span>
              </div>
            </div>
          ) : (
            /* Selected File Preview with Scanning Hologram */
            <div className="space-y-3">
              <div className="relative w-full h-[240px] rounded-2xl bg-black overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Packaging Specimen"
                  className="w-full h-full object-contain p-2"
                />

                {/* Scanning Laser Animation if Processing */}
                {isProcessing && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D5FF3F] to-transparent shadow-[0_0_20px_#D5FF3F] animate-[bounce_1.5s_infinite]" />
                )}

                {/* Change Button overlay */}
                {!isProcessing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                )}
              </div>

              {/* File Info Pill */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-zinc-200/90 text-xs font-medium">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#FF2A85] shrink-0" />
                  <span className="font-bold text-zinc-900 truncate">{selectedFile?.name}</span>
                </div>
                <span className="text-zinc-500 font-mono text-[11px] shrink-0 ml-2">
                  {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ''}
                </span>
              </div>

              {/* Processing Progress Bar */}
              {isProcessing && (
                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-700 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF2A85]" />
                      {processingStage}
                    </span>
                    <span className="text-[#FF2A85] font-mono">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF2A85] to-[#D5FF3F] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Preset Test Shortcuts */}
          {!previewUrl && (
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                Or choose test packaging specimen:
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleUseSample('/presets/compliant_biscuit.svg', 'Compliant_Biscuit_Pack.svg')}
                  className="p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/90 text-left transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D5FF3F] inline-block mr-1" />
                  <span className="font-bold text-zinc-900 block truncate">Biscuit Pack</span>
                  <span className="text-[10px] text-zinc-500 font-mono">100% Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUseSample('/presets/violating_face_cream.svg', 'Face_Cream_Missing_USP.svg')}
                  className="p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/90 text-left transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF2A85] inline-block mr-1" />
                  <span className="font-bold text-zinc-900 block truncate">Face Cream</span>
                  <span className="text-[10px] text-[#FF2A85] font-mono">Rule 6 Violation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUseSample('/presets/imported_chocolate.svg', 'Imported_Swiss_Chocolate.svg')}
                  className="p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/90 text-left transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] inline-block mr-1" />
                  <span className="font-bold text-zinc-900 block truncate">Swiss Choco</span>
                  <span className="text-[10px] text-[#8B5CF6] font-mono">No Importer</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200/80 bg-white flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-2xl transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={!selectedFile || isProcessing}
            onClick={handleRunAudit}
            className={`flex-1 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              selectedFile && !isProcessing
                ? 'bg-[#0E1118] hover:bg-black text-[#D5FF3F] active:scale-98 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D5FF3F]" />
                <span>Running LMPC Compliance Audit...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D5FF3F]" />
                <span>Run Compliance &amp; Nutrition Audit</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
