import React, { useState } from 'react';
import { Search, Filter, Wheat, Coffee, Cookie, Milk, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { ScannedItem } from './RecentlyScanned';

interface CategoryViewProps {
  onSelectItem: (item: ScannedItem) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoryItems: ScannedItem[] = [
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
    {
      id: '4',
      name: 'Rolled Oats & Chia',
      category: 'Packaged Foods',
      timeAgo: '3 days ago',
      grade: 'A+',
      gradeBg: 'bg-[#D5FF3F]',
      gradeColor: 'text-zinc-950 font-black',
      icon: Wheat,
      iconBg: 'bg-[#F4FBD6] text-zinc-900',
      presetId: 'compliant-biscuit',
    },
    {
      id: '5',
      name: 'Cold Pressed Almond Milk',
      category: 'Beverages',
      timeAgo: '4 days ago',
      grade: 'A',
      gradeBg: 'bg-[#D5FF3F]',
      gradeColor: 'text-zinc-950 font-black',
      icon: Milk,
      iconBg: 'bg-[#D7F9FB] text-zinc-900',
      presetId: 'compliant-biscuit',
    },
  ];

  const filtered = categoryItems.filter((item) => {
    const matchesCat =
      activeCategory === 'all' ||
      item.category.toLowerCase().replace(/[^a-z]/g, '').includes(activeCategory.replace(/[^a-z]/g, ''));
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pt-2 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-zinc-900 tracking-tight">
          Explore Categories
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Browse verified packaged foods, beverages &amp; snacks
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-zinc-200/90 text-xs font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D5FF3F] shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'Packaged Foods', 'Beverages', 'Snacks & Sweets'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#0E1118] text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {cat === 'all' ? 'All Items' : cat}
          </button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-2xl p-3.5 border border-zinc-200/90 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-zinc-300 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}
                >
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                    {item.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs ${item.gradeBg} ${item.gradeColor}`}
                >
                  {item.grade}
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
