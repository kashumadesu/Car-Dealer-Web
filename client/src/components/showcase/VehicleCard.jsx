import React from 'react';
import { 
  Calendar, 
  Gauge, 
  Cog, 
  Fuel, 
  Heart, 
  GitCompare, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';

export default function VehicleCard({ vehicle, onSelectVehicle, onOpenChat }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const favorited = isFavorite(vehicle.id);
  const compared = isInCompare(vehicle.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="bg-emerald-600/90 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
            Available
          </span>
        );
      case 'RESERVED':
        return (
          <span className="bg-amber-500/90 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
            Reserved
          </span>
        );
      case 'SOLD':
        return (
          <span className="bg-zinc-700/90 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
            Sold
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between text-left">
      {/* Image & Quick Action Header */}
      <div>
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
          <img
            src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {getStatusBadge(vehicle.status)}
            {vehicle.isNewArrival && (
              <span className="bg-rose-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                New Arrival
              </span>
            )}
          </div>

          {/* Compare & Favorite Quick Buttons */}
          <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 z-10">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                compared ? removeFromCompare(vehicle.id) : addToCompare(vehicle);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                compared 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'bg-zinc-900/60 text-white hover:bg-zinc-900/90'
              }`}
              title={compared ? 'Remove from compare' : 'Add to compare'}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>

            {/* Favorite Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(vehicle);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                favorited 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'bg-zinc-900/60 text-white hover:bg-zinc-900/90'
              }`}
              title={favorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          {/* Category & Verified Tag */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="uppercase font-semibold tracking-wider text-[10px] text-zinc-400">
              {vehicle.categoryId} • {vehicle.condition}
            </span>
            <span className="flex items-center space-x-1 text-emerald-600 text-[11px] font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>

          {/* Vehicle Title */}
          <h3 
            onClick={() => onSelectVehicle(vehicle)}
            className="text-sm font-bold text-zinc-900 hover:text-rose-600 cursor-pointer line-clamp-1 transition-colors"
          >
            {vehicle.year} {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-1 mb-3">{vehicle.variant}</p>

          {/* Price */}
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-lg font-black text-rose-600 tracking-tight">
              ₱{vehicle.price.toLocaleString()}
            </span>
            {vehicle.previousPrice && (
              <span className="text-xs text-zinc-400 line-through">
                ₱{vehicle.previousPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* 4-Grid Key Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-t border-b border-zinc-100 text-zinc-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{vehicle.year}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{vehicle.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cog className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 pt-1 flex items-center space-x-2">
        <button
          onClick={() => onSelectVehicle(vehicle)}
          className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center space-x-1 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onOpenChat(vehicle)}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
          title="Inquire about this vehicle"
        >
          Chat
        </button>
      </div>
    </div>
  );
}
