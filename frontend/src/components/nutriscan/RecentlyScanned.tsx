import React from 'react';
import { Wheat, Coffee, Cookie } from 'lucide-react';
import { AuditReport } from '../../types/compliance';

export interface ScannedItem {
  id: string;
  name: string;
  category: string;
  timeAgo: string;
  grade: string;
  gradeBg: string;
  gradeColor: string;
  icon: any;
  iconBg: string;
  presetId: string;
  report?: AuditReport;
}

interface RecentlyScannedProps {
  items?: ScannedItem[];
  onSelectItem: (item: ScannedItem) => void;
  onSeeAll?: () => void;
}

export const RECENT_ITEMS: ScannedItem[] = [
  {
    id: '1',
    name: 'Multigrain Crackers',
    category: 'Packaged Foods',
    timeAgo: '2h ago',
    grade: 'A+',
    gradeBg: 'bg-[#D5FF3F]',
    gradeColor: 'text-zinc-950 font-black',
    icon: Wheat,
    iconBg: 'bg-[#F4FBD6] text-zinc-900',
    presetId: 'compliant-biscuit',
  },
  {
    id: '2',
    name: 'Iced Energy Drink',
    category: 'Beverages',
    timeAgo: 'Yesterday',
    grade: 'C',
    gradeBg: 'bg-[#FF2A85]',
    gradeColor: 'text-white font-black',
    icon: Coffee,
    iconBg: 'bg-[#D7F9FB] text-zinc-900',
    presetId: 'violating-face-cream',
  },
  {
    id: '3',
    name: 'Choco Chip Cookies',
    category: 'Snacks & Sweets',
    timeAgo: '2 days ago',
    grade: 'B-',
    gradeBg: 'bg-[#8B5CF6]',
    gradeColor: 'text-white font-black',
    icon: Cookie,
    iconBg: 'bg-[#FDE2EC] text-zinc-900',
    presetId: 'imported-chocolate',
  },
];

export const RecentlyScanned: React.FC<RecentlyScannedProps> = ({
  items = RECENT_ITEMS,
  onSelectItem,
  onSeeAll,
}) => {
  return (
    <div className="pt-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5">
        <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">
          Recently Scanned
        </h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-black text-[#8B5CF6] uppercase tracking-wider hover:opacity-80 transition-opacity"
        >
          SEEALL
        </button>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-2xl p-3 sm:p-3.5 border border-zinc-200/90 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-zinc-300 hover:shadow-md active:scale-[0.99] transition-all"
            >
              {/* Left: Icon and Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-inner`}
                >
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="truncate">
                  <h4 className="font-extrabold text-[13px] sm:text-sm text-zinc-900 leading-snug truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-medium text-zinc-500 mt-0.5 truncate">
                    {item.category} · {item.timeAgo}
                  </p>
                </div>
              </div>

              {/* Right: Grade Badge */}
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-1 min-w-[32px] h-[28px] rounded-full text-xs shadow-sm ${item.gradeBg} ${item.gradeColor}`}
                >
                  {item.grade}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
