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
  return (
    <div className="bg-white border-b border-zinc-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-5 bg-rose-600 rounded-full" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 uppercase">
              Browse by Category
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold flex items-center space-x-1 transition-colors ${
              selectedCategory === 'all' ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>View All ({categories.reduce((sum, c) => sum + (c.count || 0), 0)} Cars)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Cards Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.id.toLowerCase()] || Car;
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/50 shadow-sm ring-1 ring-rose-600'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                <span className={`text-xs font-bold tracking-tight block ${isSelected ? 'text-rose-600' : 'text-zinc-900'}`}>
                  {cat.name}
                </span>

                <span className="text-[11px] text-zinc-500 mt-1">
                  {cat.count} {cat.count === 1 ? 'Unit' : 'Units'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
