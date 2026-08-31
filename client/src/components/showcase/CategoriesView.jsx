import React, { useState } from 'react';
import { 
  Car, 
  Shield, 
  Bus, 
  Truck, 
  Users, 
  Zap, 
  Flame,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import VehicleCard from './VehicleCard';

const CATEGORY_ICON_MAP = {
  sedan: Car,
  suv: Shield,
  van: Bus,
  pickup: Truck,
  mpv: Users,
  hatchback: Zap,
  coupe: Flame
};

export default function CategoriesView({ 
  categories, 
  vehicles, 
  onSelectVehicle, 
  onOpenChat 
}) {
  const [selectedCatId, setSelectedCatId] = useState('all');

  const filteredVehicles = selectedCatId === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.categoryId.toLowerCase() === selectedCatId.toLowerCase());

  const activeCategoryObj = categories.find(c => c.id === selectedCatId);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-5">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-rose-600" />
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">Browse by Category</h1>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Explore our showroom organized by body style, vehicle purpose, and passenger capacity.</p>
      </div>

      {/* Category Pills & Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* All Pill */}
        <button
          onClick={() => setSelectedCatId('all')}
          className={`flex items-center space-x-2 p-2.5 rounded-xl border transition-all ${
            selectedCatId === 'all'
              ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs font-bold'
              : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            selectedCatId === 'all' ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-600'
          }`}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <span className="text-xs font-bold block truncate">All Cars</span>
            <span className="text-[10px] text-zinc-400 font-medium">{vehicles.length} Units</span>
          </div>
        </button>

        {categories.map((cat) => {
          const Icon = CATEGORY_ICON_MAP[cat.id.toLowerCase()] || Car;
          const isSelected = selectedCatId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`flex items-center space-x-2 p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs font-bold'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-xs font-bold block truncate">{cat.name}</span>
                <span className="text-[10px] text-zinc-400 font-medium">{cat.count} {cat.count === 1 ? 'unit' : 'units'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Banner */}
      <div className="bg-zinc-950 text-white p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>{activeCategoryObj ? `${activeCategoryObj.name} Inventory` : 'All Available Categories'}</span>
            <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-semibold">
              {filteredVehicles.length} Units Found
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {activeCategoryObj ? activeCategoryObj.description : 'Explore all inspected and certified dealership units ready for immediate transfer.'}
          </p>
        </div>
      </div>

      {/* Vehicles Grid under selected category */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelectVehicle={onSelectVehicle}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-3">
          <Car className="w-10 h-10 text-zinc-300 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-800">No units currently available under this category</h3>
          <p className="text-xs text-zinc-500">Check back soon or message our sales consultants to request a specific model.</p>
          <button
            onClick={() => setSelectedCatId('all')}
            className="text-xs bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-lg"
          >
            View All Categories
          </button>
        </div>
      )}
    </div>
  );
}
