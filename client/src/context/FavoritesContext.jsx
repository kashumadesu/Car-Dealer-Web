import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('drivehub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('drivehub_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (vehicle) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === vehicle.id);
      if (exists) {
        return prev.filter(item => item.id !== vehicle.id);
      } else {
        return [...prev, vehicle];
      }
    });
  };

  const isFavorite = (vehicleId) => {
    return favorites.some(item => item.id === vehicleId);
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
