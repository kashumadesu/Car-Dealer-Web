import React from 'react';
import { 
  Car, 
  Shield, 
  Bus, 
  Truck, 
  Users, 
  Zap, 
  Flame,
  ChevronRight
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  sedan: Car,
  suv: Shield,
  van: Bus,
  pickup: Truck,
  mpv: Users,
  hatchback: Zap,
  coupe: Flame
};

export default function CategoryExplorer({ categories, selectedCategory, onSelectCategory }) {
  const totalCount = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <section className="bg-white border-b border-zinc-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-4.5 bg-rose-600 rounded-full" />
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-900 uppercase">
              Browse by Category
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold flex items-center space-x-1 transition-colors ${
              selectedCategory === 'all' ? 'text-rose-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>All ({totalCount})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.id.toLowerCase()] || Car;
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group flex items-center space-x-2.5 p-2.5 rounded-lg border transition-all duration-150 text-left ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/70 shadow-xs ring-1 ring-rose-600'
                    : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-rose-600 text-white' : 'bg-white border border-zinc-200 text-zinc-700 group-hover:text-rose-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-bold block truncate leading-tight ${isSelected ? 'text-rose-700' : 'text-zinc-900'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {cat.count} {cat.count === 1 ? 'car' : 'cars'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
