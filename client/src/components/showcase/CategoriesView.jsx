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

export default function CategoriesView({ categories, onSelectCategory }) {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 min-h-[80vh]">
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-rose-600" />
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Vehicle Categories</h1>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Explore our showroom organized by body type, purpose, and passenger capacity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICON_MAP[cat.id.toLowerCase()] || Car;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 group-hover:bg-rose-50 text-zinc-800 group-hover:text-rose-600 flex items-center justify-center transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 group-hover:bg-rose-100 text-zinc-700 group-hover:text-rose-700 transition-colors">
                    {cat.count} Available
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                <span>Browse {cat.name} Inventory</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
