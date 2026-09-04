import React from 'react';

/**
 * Official Government of India & Consumer Affairs Emblems:
 * 1. Jago Grahak Jago (जागो ग्राहक जागो)
 * 2. National Consumer Helpline (1915 / 1800-11-4000)
 * 3. State Emblem of India (Ashoka Lion Capital & Satyameva Jayate)
 * 4. Department of Consumer Affairs Crest
 */

export const JagoGrahakJagoLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 36,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 shrink-0 select-none ${className}`}
      title="Jago Grahak Jago - Ministry of Consumer Affairs Initiative"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r="46" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2" />
        {/* Sun Rays */}
        <g stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
          <line x1="50" y1="12" x2="50" y2="4" />
          <line x1="50" y1="88" x2="50" y2="96" />
          <line x1="12" y1="50" x2="4" y2="50" />
          <line x1="88" y1="50" x2="96" y2="50" />
          <line x1="23" y1="23" x2="17" y2="17" />
          <line x1="77" y1="77" x2="83" y2="83" />
          <line x1="23" y1="77" x2="17" y2="83" />
          <line x1="77" y1="23" x2="83" y2="17" />
        </g>
        {/* Inner Sun Center */}
        <circle cx="50" cy="50" r="32" fill="#FBBF24" stroke="#DC2626" strokeWidth="2" />
        {/* Devanagari "जागो" Top */}
        <text
          x="50"
          y="42"
          textAnchor="middle"
          fill="#7F1D1D"
          fontFamily="'Arial', sans-serif"
          fontSize="14"
          fontWeight="900"
          letterSpacing="0.5"
        >
          जागो
        </text>
        {/* Devanagari "ग्राहक जागो" Bottom */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="#991B1B"
          fontFamily="'Arial', sans-serif"
          fontSize="11"
          fontWeight="900"
        >
          ग्राहक जागो
        </text>
      </svg>
      <div className="hidden sm:flex flex-col text-left leading-none">
        <span className="text-[10px] font-black text-amber-950 uppercase tracking-tight">
          जागो ग्राहक जागो
        </span>
        <span className="text-[8px] font-bold text-amber-700 tracking-wider">
          JAGO GRAHAK JAGO
        </span>
      </div>
    </div>
  );
};

export const NationalConsumerHelplineBadge: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-950 shrink-0 select-none ${className}`}
      title="National Consumer Helpline - 1915 or 1800-11-4000"
    >
      <div className="w-5 h-5 rounded-full bg-[#EAB308] text-zinc-950 flex items-center justify-center font-black text-[9px] shadow-xs shrink-0">
        📞
      </div>
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1 font-mono font-black text-[10px] text-zinc-900">
          <span>1915</span>
          <span className="text-zinc-400 text-[8px]">OR</span>
          <span className="text-[9px]">1800-11-4000</span>
        </div>
        <span className="text-[7.5px] font-extrabold text-amber-800 uppercase tracking-wider">
          National Consumer Helpline (NCH)
        </span>
      </div>
    </div>
  );
};

export const AshokaEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 shrink-0 select-none ${className}`}
      title="Government of India • भारत सरकार"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        <rect width="60" height="60" rx="12" fill="#0E1118" />
        {/* Ashoka Pillar Stylized representation */}
        {/* Abacus platform */}
        <rect x="15" y="42" width="30" height="4" rx="1.5" fill="#D5FF3F" />
        {/* Central Ashoka Chakra */}
        <circle cx="30" cy="44" r="2.2" fill="#0E1118" stroke="#D5FF3F" strokeWidth="0.8" />
        {/* Lions silhouette */}
        <path
          d="M24 16C24 13.5 26.5 11 30 11C33.5 11 36 13.5 36 16C38.5 17 40 19.5 40 23C40 27 37 29 35 30L35 41L25 41L25 30C23 29 20 27 20 23C20 19.5 21.5 17 24 16Z"
          fill="#D5FF3F"
          opacity="0.9"
        />
        {/* Base text */}
        <text
          x="30"
          y="54"
          textAnchor="middle"
          fill="#E5E7EB"
          fontFamily="'Arial', sans-serif"
          fontSize="6"
          fontWeight="bold"
        >
          सत्यमेव जयते
        </text>
      </svg>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[9px] font-black text-zinc-900 uppercase tracking-wide">
          भारत सरकार
        </span>
        <span className="text-[7.5px] font-semibold text-zinc-500 uppercase tracking-wider">
          Govt. of India
        </span>
      </div>
    </div>
  );
};

export const GovtTrustBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`w-full bg-white/90 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs ${className}`}
    >
      <div className="flex items-center gap-3">
        <AshokaEmblem size={32} />
        <div className="h-6 w-px bg-zinc-200 hidden sm:block" />
        <div className="hidden md:block">
          <p className="text-[11px] font-extrabold text-zinc-900 leading-tight">
            उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय
          </p>
          <p className="text-[9px] font-medium text-zinc-500">
            Ministry of Consumer Affairs, Food &amp; Public Distribution • Legal Metrology Division
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <JagoGrahakJagoLogo size={28} />
        <NationalConsumerHelplineBadge />
      </div>
    </div>
  );
};
