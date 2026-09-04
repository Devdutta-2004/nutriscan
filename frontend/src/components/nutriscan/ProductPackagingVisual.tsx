import React from 'react';

export type PackagingType = 'biscuit' | 'chocolate' | 'cosmetic' | 'soda' | 'protein';

interface ProductPackagingVisualProps {
  type: PackagingType;
  className?: string;
}

export const ProductPackagingVisual: React.FC<ProductPackagingVisualProps> = ({
  type,
  className = '',
}) => {
  if (type === 'biscuit') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="biscuit-pack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="foil-shine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFF" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Packaging Pillow Pouch */}
          <rect x="25" y="30" width="270" height="160" rx="18" fill="url(#biscuit-pack)" />
          {/* Crimped Left and Right Edges */}
          <path d="M25 30 L10 40 L25 50 L10 60 L25 70 L10 80 L25 90 L10 100 L25 110 L10 120 L25 130 L10 140 L25 150 L10 160 L25 170 L10 180 L25 190 Z" fill="#92400E" />
          <path d="M295 30 L310 40 L295 50 L310 60 L295 70 L310 80 L295 90 L310 100 L295 110 L310 120 L295 130 L310 140 L295 150 L310 160 L295 170 L310 180 L295 190 Z" fill="#92400E" />
          {/* Foil Gloss overlay */}
          <rect x="25" y="30" width="270" height="160" rx="18" fill="url(#foil-shine)" />
          
          {/* Brand Header Banner */}
          <rect x="40" y="45" width="240" height="34" rx="8" fill="#18181B" opacity="0.9" />
          <text x="52" y="66" fill="#D5FF3F" fontSize="13" fontWeight="900" letterSpacing="1">DIGESTIVE WHEAT</text>
          <text x="265" y="66" fill="#A1A1AA" fontSize="10" fontWeight="700" textAnchor="end">100% ATTA</text>

          {/* Biscuit Disc Graphic */}
          <circle cx="90" cy="130" r="38" fill="#FDE68A" stroke="#D97706" strokeWidth="3" />
          <circle cx="90" cy="130" r="32" fill="#F59E0B" opacity="0.6" strokeDasharray="3 3" />
          <circle cx="90" cy="130" r="4" fill="#92400E" />
          <circle cx="80" cy="120" r="2.5" fill="#92400E" />
          <circle cx="100" cy="120" r="2.5" fill="#92400E" />
          <circle cx="80" cy="140" r="2.5" fill="#92400E" />
          <circle cx="100" cy="140" r="2.5" fill="#92400E" />

          {/* Statutory PDP Callout on pack */}
          <rect x="145" y="95" width="135" height="78" rx="8" fill="#0E1118" opacity="0.92" />
          <text x="155" y="113" fill="#D5FF3F" fontSize="9" fontWeight="900">NET QTY: 400 g</text>
          <text x="155" y="130" fill="#FFFFFF" fontSize="10" fontWeight="900">MRP: ₹80.00</text>
          <text x="155" y="145" fill="#A1A1AA" fontSize="8" fontWeight="600">INCL. OF ALL TAXES</text>
          <text x="155" y="162" fill="#34D399" fontSize="9" fontWeight="800">USP: ₹0.20/g</text>

          {/* Green Veg Dot */}
          <rect x="250" y="103" width="18" height="18" fill="#FFF" stroke="#16A34A" strokeWidth="1.5" rx="3" />
          <circle cx="259" cy="112" r="4.5" fill="#16A34A" />
        </svg>
      </div>
    );
  }

  if (type === 'chocolate') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="choc-wrap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4C1D95" />
              <stop offset="50%" stopColor="#5B21B6" />
              <stop offset="100%" stopColor="#2E1065" />
            </linearGradient>
            <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Main Chocolate Block Wrapper */}
          <rect x="50" y="25" width="220" height="170" rx="14" fill="url(#choc-wrap)" />
          {/* Gold Foil Top Corner Reveal */}
          <path d="M50 25 L120 25 L50 85 Z" fill="url(#gold-foil)" />
          <path d="M50 85 L120 25" stroke="#A16207" strokeWidth="1" />

          {/* Brand Emblem */}
          <circle cx="160" cy="65" r="20" fill="url(#gold-foil)" />
          <text x="160" y="70" fill="#2E1065" fontSize="14" fontWeight="900" textAnchor="middle">SN</text>
          
          <text x="160" y="102" fill="#FDE047" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="1.5">
            SWISS DARK NOIR
          </text>
          <text x="160" y="116" fill="#DDD6FE" fontSize="9" fontWeight="600" textAnchor="middle">
            70% COCOA • IMPORTED PACK
          </text>

          {/* Statutory PDP Tag */}
          <rect x="70" y="130" width="180" height="52" rx="8" fill="#1E1B4B" stroke="#6D28D9" strokeWidth="1" />
          <text x="80" y="148" fill="#FFFFFF" fontSize="10" fontWeight="900">MRP: ₹240.00 (INCL. TAXES)</text>
          <text x="80" y="162" fill="#FDE047" fontSize="9" fontWeight="800">NET WT: 100g • USP: ₹2.40/g</text>
          <text x="80" y="174" fill="#A78BFA" fontSize="8" fontWeight="600">ORIGIN: SWITZERLAND • PIN 400001</text>
        </svg>
      </div>
    );
  }

  if (type === 'cosmetic') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="cream-jar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="50%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="lid-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          {/* Frosted Lid */}
          <ellipse cx="160" cy="50" rx="90" ry="22" fill="url(#lid-gold)" stroke="#64748B" strokeWidth="1" />
          <rect x="70" y="50" width="180" height="24" fill="url(#lid-gold)" />
          <ellipse cx="160" cy="74" rx="90" ry="16" fill="#94A3B8" opacity="0.4" />

          {/* Jar Body */}
          <path d="M75 70 C75 140, 85 180, 160 180 C235 180, 245 140, 245 70 Z" fill="url(#cream-jar)" stroke="#DB2777" strokeWidth="1.5" />
          <ellipse cx="160" cy="70" rx="85" ry="12" fill="#FDF2F8" />

          {/* Label Panel */}
          <rect x="105" y="95" width="110" height="65" rx="10" fill="#FFFFFF" opacity="0.95" stroke="#F472B6" strokeWidth="1" />
          <text x="160" y="112" fill="#BE185D" fontSize="10" fontWeight="900" textAnchor="middle">DERMA GLOW</text>
          <text x="160" y="125" fill="#475569" fontSize="8" fontWeight="700" textAnchor="middle">NIGHT REPAIR (50g)</text>
          
          {/* Violation Indicator tag */}
          <rect x="115" y="132" width="90" height="20" rx="4" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1" />
          <text x="160" y="145" fill="#BE123C" fontSize="7.5" fontWeight="900" textAnchor="middle">TAX EXCL. DETECTED</text>
        </svg>
      </div>
    );
  }

  if (type === 'soda') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="can-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891B2" />
              <stop offset="30%" stopColor="#06B6D4" />
              <stop offset="70%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <linearGradient id="can-metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          {/* Can Top Rim */}
          <ellipse cx="160" cy="30" rx="60" ry="12" fill="url(#can-metal)" stroke="#64748B" />
          <ellipse cx="160" cy="29" rx="45" ry="8" fill="#CBD5E1" />
          {/* Tab */}
          <rect x="156" y="24" width="8" height="10" rx="2" fill="#64748B" />

          {/* Can Cylinder Body */}
          <path d="M100 30 L100 180 C100 195, 220 195, 220 180 L220 30 Z" fill="url(#can-body)" />
          <ellipse cx="160" cy="180" rx="60" ry="12" fill="url(#can-metal)" />

          {/* Energy Bolt Graphics */}
          <path d="M165 55 L140 100 L160 100 L145 145 L180 90 L160 90 Z" fill="#D5FF3F" />
          
          <text x="160" y="125" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="1">
            BOLT SODA
          </text>
          <text x="160" y="138" fill="#CFFAFE" fontSize="8" fontWeight="700" textAnchor="middle">
            SPARKLING ZERO SUGAR
          </text>

          {/* Legal PDP Callout Banner */}
          <rect x="115" y="148" width="90" height="36" rx="6" fill="#083344" opacity="0.9" />
          <text x="160" y="160" fill="#22D3EE" fontSize="8" fontWeight="800" textAnchor="middle">NET: 330 ml</text>
          <text x="160" y="172" fill="#FFFFFF" fontSize="8.5" fontWeight="900" textAnchor="middle">MRP ₹40 (INCL TAX)</text>
        </svg>
      </div>
    );
  }

  // default 'protein' tub
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <linearGradient id="tub-black" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181B" />
            <stop offset="35%" stopColor="#27272A" />
            <stop offset="70%" stopColor="#3F3F46" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
        </defs>
        {/* Tub Lid */}
        <ellipse cx="160" cy="35" rx="80" ry="18" fill="#D5FF3F" />
        <rect x="80" y="35" width="160" height="22" fill="#A3E635" />
        <ellipse cx="160" cy="57" rx="80" ry="14" fill="#65A30D" opacity="0.6" />

        {/* Tub Body */}
        <path d="M80 55 L85 185 C85 200, 235 200, 235 185 L240 55 Z" fill="url(#tub-black)" />
        <ellipse cx="160" cy="185" rx="75" ry="14" fill="#09090B" />

        {/* Label Front Panel */}
        <rect x="95" y="75" width="130" height="98" rx="8" fill="#18181B" stroke="#D5FF3F" strokeWidth="1.5" />
        <text x="160" y="96" fill="#D5FF3F" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
          100% WHEY ISOLATE
        </text>
        <text x="160" y="109" fill="#A1A1AA" fontSize="8" fontWeight="700" textAnchor="middle">
          27g PROTEIN • ULTRA FILTERED
        </text>

        {/* Statutory Information Box */}
        <rect x="105" y="117" width="110" height="48" rx="6" fill="#27272A" />
        <text x="112" y="131" fill="#FFFFFF" fontSize="8" fontWeight="800">NET WT: 1.0 kg (1000g)</text>
        <text x="112" y="143" fill="#D5FF3F" fontSize="8.5" fontWeight="900">MRP: ₹3,299.00</text>
        <text x="112" y="156" fill="#34D399" fontSize="7.5" fontWeight="700">USP: ₹3.30 / g • 100% LAWFUL</text>
      </svg>
    </div>
  );
};
