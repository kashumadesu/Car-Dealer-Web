import React from 'react';
import { Heart, Trash2, Car, ChevronRight } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import VehicleCard from './VehicleCard';

export default function FavoritesView({ onSelectVehicle, onOpenChat, onBrowseMore }) {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left min-h-[70vh]">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
        <div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-600 fill-current" />
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Saved Favorites</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Keep track of the vehicles you are considering before visiting the showroom.</p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved</span>
          </button>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onSelectVehicle={onSelectVehicle}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center space-y-4 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Your Favorites List is Empty</h3>
          <p className="text-xs text-zinc-500">
            Click the heart icon on any vehicle card to bookmark cars you want to review or compare later.
          </p>
          <button
            onClick={onBrowseMore}
            className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <span>Explore Showroom</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
