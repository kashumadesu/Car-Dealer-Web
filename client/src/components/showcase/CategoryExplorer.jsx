import React from 'react';
import { 
  Car, 
  Shield, 
  Bus, 
  Truck, 
  Users, 
  Zap, 
  Flame,
  ChevronRight,
  Layers
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
    <section className="bg-zinc-100 border-b border-zinc-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-6 bg-rose-600 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 uppercase">
              Browse by Category
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className={`text-sm font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto ${
              selectedCategory === 'all' ? 'text-rose-600 underline' : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <span>Show All Categories ({totalCount} Units)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* High-Contrast Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.id.toLowerCase()] || Car;
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-rose-600 bg-white shadow-md ring-2 ring-rose-600/30'
                    : 'border-zinc-300 bg-white hover:border-rose-400 hover:shadow-sm'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-900 group-hover:bg-rose-50 group-hover:text-rose-600'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>

                <span className={`text-sm font-bold tracking-tight block ${isSelected ? 'text-rose-600' : 'text-zinc-900'}`}>
                  {cat.name}
                </span>

                <span className="text-xs font-semibold text-zinc-500 mt-1 bg-zinc-100 px-2 py-0.5 rounded-md">
                  {cat.count} {cat.count === 1 ? 'Unit' : 'Units'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
