import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, Loader2, ArrowRight, RefreshCw, FileText, Camera } from 'lucide-react';
import { FairPackAPI } from '../../services/api';
import { AuditReport } from '../../types/compliance';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuditComplete: (report: AuditReport) => void;
}

export const UploadProductModal: React.FC<UploadProductModalProps> = ({
  isOpen,
  onClose,
  onAuditComplete,
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

  const handleRunAudit = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setProgressPercent(10);
    setProcessingStage('Reading packaging image & contrast normalization...');

    try {
      // Execute real in-browser OCR & deterministic audit
      const report = await FairPackAPI.uploadImageAndAudit(selectedFile, (stage, percent) => {
        setProcessingStage(stage);
        setProgressPercent(percent);
      });

      setIsProcessing(false);
      onAuditComplete(report);
      onClose();

      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setProgressPercent(0);
    } catch (err) {
      console.error('Audit processing failed:', err);
      setIsProcessing(false);
      setProcessingStage('Error reading label. Please try another image.');
    }
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
            <div className="w-10 h-10 rounded-2xl bg-[#0E1118] text-[#D5FF3F] flex items-center justify-center font-black shadow-sm">
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 tracking-tight leading-tight">
                Live Label OCR Scanner
              </h3>
              <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">
                Upload packaging artwork or live camera photo for instant LMPC audit
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
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* File Input (Hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {/* Drag & Drop Zone (if no file chosen yet) */}
          {!previewUrl ? (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 bg-white ${
                isDragOver
                  ? 'border-[#D5FF3F] bg-[#D5FF3F]/10 scale-[1.01]'
                  : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/80'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0E1118] text-[#D5FF3F] flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7 stroke-[2.2]" />
              </div>

              <h4 className="font-black text-sm text-zinc-900 tracking-tight">
                Choose a product packaging image
              </h4>
              <p className="text-xs text-zinc-500 font-medium mt-1 max-w-xs">
                Drag and drop your front/back label photo here, or browse files from your phone or Mac
              </p>

              <div className="flex items-center gap-2 mt-4">
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  PNG
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  JPG
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-bold border border-zinc-200">
                  WebP
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
                  <span className="text-[10px] text-zinc-500 font-mono">No USP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUseSample('/presets/imported_chocolate.svg', 'Swiss_Choco_Mismatch.svg')}
                  className="p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/90 text-left transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] inline-block mr-1" />
                  <span className="font-bold text-zinc-900 block truncate">Swiss Choco</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Math Error</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-zinc-200/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleRunAudit}
            disabled={!selectedFile || isProcessing}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
              !selectedFile || isProcessing
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-[#0E1118] text-[#D5FF3F] hover:bg-black active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D5FF3F]" />
                <span>Running Optical &amp; Legal Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D5FF3F]" />
                <span>Run Compliance &amp; Nutrition Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
