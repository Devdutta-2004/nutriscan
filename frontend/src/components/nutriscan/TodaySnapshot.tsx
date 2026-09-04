import React, { useState } from 'react';
import { Info, Sparkles } from 'lucide-react';

interface NutrientInfo {
  name: string;
  percentage: number;
  grams: string;
  color: string;
  status: 'OPTIMAL' | 'MODERATE' | 'ELEVATED';
}

const NUTRIENTS: NutrientInfo[] = [
  { name: 'Sugar', percentage: 34, grams: '24g', color: '#FF2A85', status: 'ELEVATED' },
  { name: 'Protein', percentage: 22, grams: '32g', color: '#26E1E8', status: 'OPTIMAL' },
  { name: 'Fiber', percentage: 18, grams: '14g', color: '#D5FF3F', status: 'OPTIMAL' },
  { name: 'Fat', percentage: 26, grams: '18g', color: '#8B5CF6', status: 'MODERATE' },
];

interface TodaySnapshotProps {
  onViewAll?: () => void;
}

export const TodaySnapshot: React.FC<TodaySnapshotProps> = ({ onViewAll }) => {
  const [activeNutrient, setActiveNutrient] = useState<NutrientInfo | null>(null);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  const sugarLen = (34 / 100) * circumference;
  const proteinLen = (22 / 100) * circumference;
  const fiberLen = (18 / 100) * circumference;
  const fatLen = (26 / 100) * circumference;

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-base font-extrabold text-zinc-900 tracking-tight flex items-center gap-1.5">
          <span>Today's Snapshot</span>
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-black text-[#FF2A85] uppercase tracking-wider hover:opacity-80 transition-opacity"
        >
          VIEW ALL
        </button>
      </div>

      {/* Snapshot White Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
        {/* Left: Donut Chart with 100% */}
        <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 88 88">
            {/* Background track */}
            <circle cx="44" cy="44" r={radius} stroke="#f4f4f5" strokeWidth="9" fill="none" />

            {/* Pink Segment: Sugar 34% */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="#FF2A85"
              strokeWidth={activeNutrient?.name === 'Sugar' ? '12' : '9'}
              strokeDasharray={`${sugarLen} ${circumference}`}
              strokeDashoffset={0}
              fill="none"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setActiveNutrient(NUTRIENTS[0])}
              onMouseLeave={() => setActiveNutrient(null)}
            />

            {/* Cyan Segment: Protein 22% */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="#26E1E8"
              strokeWidth={activeNutrient?.name === 'Protein' ? '12' : '9'}
              strokeDasharray={`${proteinLen} ${circumference}`}
              strokeDashoffset={-sugarLen}
              fill="none"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setActiveNutrient(NUTRIENTS[1])}
              onMouseLeave={() => setActiveNutrient(null)}
            />

            {/* Lime Segment: Fiber 18% */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="#D5FF3F"
              strokeWidth={activeNutrient?.name === 'Fiber' ? '12' : '9'}
              strokeDasharray={`${fiberLen} ${circumference}`}
              strokeDashoffset={-(sugarLen + proteinLen)}
              fill="none"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setActiveNutrient(NUTRIENTS[2])}
              onMouseLeave={() => setActiveNutrient(null)}
            />

            {/* Purple Segment: Fat 26% */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="#8B5CF6"
              strokeWidth={activeNutrient?.name === 'Fat' ? '12' : '9'}
              strokeDasharray={`${fatLen} ${circumference}`}
              strokeDashoffset={-(sugarLen + proteinLen + fiberLen)}
              fill="none"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setActiveNutrient(NUTRIENTS[3])}
              onMouseLeave={() => setActiveNutrient(null)}
            />
          </svg>

          {/* Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-black text-zinc-900 font-sans">
              {activeNutrient ? `${activeNutrient.percentage}%` : '100%'}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
              {activeNutrient ? activeNutrient.name : 'Balanced'}
            </span>
          </div>
        </div>

        {/* Right: 2x2 Interactive Legend Grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-xs w-full sm:w-auto">
          {NUTRIENTS.map((n) => {
            const isSelected = activeNutrient?.name === n.name;
            return (
              <div
                key={n.name}
                onMouseEnter={() => setActiveNutrient(n)}
                onMouseLeave={() => setActiveNutrient(null)}
                onClick={() => setActiveNutrient(isSelected ? null : n)}
                className={`flex items-center justify-between sm:justify-start gap-2 p-1.5 rounded-xl cursor-pointer transition-all ${
                  isSelected ? 'bg-zinc-100 ring-1 ring-zinc-300' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: n.color }}
                  />
                  <span className="font-bold text-zinc-800 text-[11px] sm:text-xs">
                    {n.name} {n.percentage}%
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium text-zinc-400 sm:hidden">
                  {n.grams}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
