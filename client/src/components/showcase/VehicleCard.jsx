import React from 'react';
import { 
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
import { useAuth } from '../../context/AuthContext';

export default function VehicleCard({ vehicle, onSelectVehicle, onOpenChat }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { user, promptSignIn } = useAuth();

  const favorited = isFavorite(vehicle.id);
  const compared = isInCompare(vehicle.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-xs">
            Available
          </span>
        );
      case 'RESERVED':
        return (
          <span className="bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-xs">
            Reserved
          </span>
        );
      case 'SOLD':
        return (
          <span className="bg-zinc-700 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-xs">
            Sold
          </span>
        );
      default:
        return null;
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      promptSignIn('Sign in to save this vehicle to your personal favorites.');
      return;
    }
    toggleFavorite(vehicle);
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    if (!user) {
      promptSignIn('Sign in with your Name so our sales agent knows who is inquiring about this vehicle.');
      return;
    }
    onOpenChat(vehicle);
  };

  return (
    <div className="group bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 shadow-xs hover:shadow-md transition-all duration-150 overflow-hidden flex flex-col justify-between text-left">
      <div>
        {/* Car Image with Clean 16:10 Ratio */}
        <div 
          className="relative aspect-16/10 overflow-hidden bg-zinc-100 cursor-pointer" 
          onClick={() => onSelectVehicle(vehicle)}
        >
          <img
            src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-250"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-10">
            {getStatusBadge(vehicle.status)}
            {vehicle.isNewArrival && (
              <span className="bg-rose-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-xs">
                New
              </span>
            )}
          </div>

          {/* Compare & Favorite Buttons */}
          <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                compared ? removeFromCompare(vehicle.id) : addToCompare(vehicle);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                compared 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'bg-zinc-900/60 text-white hover:bg-zinc-900/90'
              }`}
              title={compared ? 'Remove from compare' : 'Add to compare'}
            >
              <GitCompare className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                favorited 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'bg-zinc-900/60 text-white hover:bg-zinc-900/90'
              }`}
              title={favorited ? 'Remove favorite' : 'Add favorite (requires sign in)'}
            >
              <Heart className={`w-3 h-3 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Compact Card Body */}
        <div className="p-3.5 space-y-2">
          {/* Condition & Verified Badge */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span className="uppercase tracking-wider font-semibold text-zinc-500">
              {vehicle.condition}
            </span>
            <span className="flex items-center space-x-0.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Title</span>
            </span>
          </div>

          <div>
            <h3 
              onClick={() => onSelectVehicle(vehicle)}
              className="text-sm font-bold text-zinc-900 hover:text-rose-600 cursor-pointer line-clamp-1 transition-colors leading-snug"
            >
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-1">{vehicle.variant}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-1.5 pt-0.5">
            <span className="text-base font-black text-rose-600 tracking-tight">
              ₱{vehicle.price.toLocaleString()}
            </span>
            {vehicle.previousPrice && (
              <span className="text-[11px] text-zinc-400 line-through">
                ₱{vehicle.previousPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Compact 3-Bullet Specs */}
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-2 border-t border-zinc-100">
            <div className="flex items-center space-x-1">
              <Gauge className="w-3 h-3 text-zinc-400" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <Cog className="w-3 h-3 text-zinc-400" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="w-3 h-3 text-zinc-400" />
              <span>{vehicle.fuelType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 pt-0 flex items-center space-x-2">
        <button
          onClick={() => onSelectVehicle(vehicle)}
          className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2 px-2.5 rounded-lg flex items-center justify-center space-x-1 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        <button
          onClick={handleChatClick}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors flex items-center space-x-1"
          title="Inquire about this unit"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}
