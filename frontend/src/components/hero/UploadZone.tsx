import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck, Sparkles, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { DemoPreset } from '../../types/compliance';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  presets: DemoPreset[];
  activePresetId?: string;
  onSelectPreset: (presetId: string) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  presets,
  activePresetId,
  onSelectPreset,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.pdf')) {
      alert('Please upload an image (JPG, PNG, WebP) or packaging PDF artwork.');
      return;
    }

    // Simulate kinetic multi-stage ingestion indicator
    setProcessingStage('Deskewing & Contrast Normalization...');
    setTimeout(() => {
      setProcessingStage('Layout-Aware Token Extraction (OCR)...');
      setTimeout(() => {
        setProcessingStage('Evaluating Deterministic Math & RAG...');
        onFileUpload(file);
      }, 500);
    }, 400);
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl p-6 sm:p-8 transition-all duration-300 overflow-hidden border-2 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_40px_rgba(16,185,129,0.25)] scale-[1.01]'
            : 'border-dashed border-white/15 hover:border-emerald-500/40 bg-zinc-900/40 hover:bg-zinc-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelected(e.target.files[0]);
            }
          }}
        />

        {/* Ambient background glow line */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                isProcessing
                  ? 'bg-emerald-500/20 text-emerald-400 animate-spin'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
              ) : (
                <UploadCloud className="w-7 h-7 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base sm:text-lg text-white font-sans">
                  {isProcessing
                    ? processingStage || 'Auditing packaging artwork...'
                    : 'Drop packaging artwork or label image'}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded-full bg-white/5 border border-white/10 text-zinc-400">
                  PNG, JPG, WebP, SVG
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {isProcessing
                  ? 'Normalized tokens with bounding box coordinates [x, y, w, h]'
                  : 'Automatic deskewing, tokenization, and deterministic LMPC rule audit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              Select File
            </button>
          </div>
        </div>

        {/* Real-time processing progress banner if active */}
        {isProcessing && (
          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center gap-2 text-xs font-mono text-emerald-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Pipeline: {processingStage || 'Extracting LMPC Mandates'}</span>
          </div>
        )}
      </div>

      {/* Preset Showcase Tray */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-zinc-400">Quick Test Demonstrations:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-zinc-800 text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-zinc-900/80 text-zinc-400 border-white/[0.08] hover:text-zinc-200 hover:border-white/20'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    p.expected_score === 100
                      ? 'bg-emerald-400'
                      : p.expected_score >= 70
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                />
                <span className="font-semibold text-zinc-200">{p.title}</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  ({p.expected_score}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
