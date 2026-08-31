import React from 'react';
import { 
  Calendar, 
  Gauge, 
  Cog, 
  Fuel, 
  Heart, 
  GitCompare, 
  ChevronRight, 
  ShieldCheck,
  MessageSquare
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
          <span className="bg-emerald-600 text-white text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">
            Available
          </span>
        );
      case 'RESERVED':
        return (
          <span className="bg-amber-500 text-white text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">
            Reserved
          </span>
        );
      case 'SOLD':
        return (
          <span className="bg-zinc-700 text-white text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">
            Sold
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border-2 border-zinc-200 hover:border-rose-400 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between text-left">
      <div>
        {/* Car Photography */}
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
          <img
            src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {getStatusBadge(vehicle.status)}
            {vehicle.isNewArrival && (
              <span className="bg-rose-600 text-white text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">
                New Arrival
              </span>
            )}
          </div>

          {/* Compare & Favorite Buttons */}
          <div className="absolute top-3 right-3 flex items-center space-x-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                compared ? removeFromCompare(vehicle.id) : addToCompare(vehicle);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                compared 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'bg-zinc-950/70 text-white hover:bg-zinc-950'
              }`}
              title={compared ? 'Remove from compare' : 'Add to compare'}
            >
              <GitCompare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(vehicle);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                favorited 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'bg-zinc-950/70 text-white hover:bg-zinc-950'
              }`}
              title={favorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Category & Verified Tag */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="uppercase font-bold tracking-wider text-xs text-zinc-500">
              {vehicle.categoryId} • {vehicle.condition}
            </span>
            <span className="flex items-center space-x-1 text-emerald-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Title</span>
            </span>
          </div>

          {/* Vehicle Title */}
          <div>
            <h3 
              onClick={() => onSelectVehicle(vehicle)}
              className="text-base sm:text-lg font-black text-zinc-900 hover:text-rose-600 cursor-pointer line-clamp-1 transition-colors tracking-tight"
            >
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 font-medium line-clamp-1 mt-0.5">{vehicle.variant}</p>
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
              ₱{vehicle.price.toLocaleString()}
            </span>
            {vehicle.previousPrice && (
              <span className="text-xs sm:text-sm text-zinc-400 line-through font-semibold">
                ₱{vehicle.previousPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* 4-Grid Key Specs with High Readability */}
          <div className="grid grid-cols-2 gap-2.5 py-3 border-t border-b border-zinc-200 text-xs sm:text-sm text-zinc-800 font-medium">
            <div className="flex items-center space-x-2 bg-zinc-50 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{vehicle.year} Model</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-50 p-2 rounded-lg">
              <Gauge className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{vehicle.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-50 p-2 rounded-lg">
              <Cog className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-50 p-2 rounded-lg">
              <Fuel className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-1 flex items-center space-x-2.5">
        <button
          onClick={() => onSelectVehicle(vehicle)}
          className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onOpenChat(vehicle)}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-200 text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-colors flex items-center space-x-1"
          title="Inquire about this vehicle"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inquire</span>
        </button>
      </div>
    </div>
  );
}
