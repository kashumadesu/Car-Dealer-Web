import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (vehicle) => {
    setCompareList(prev => {
      if (prev.some(v => v.id === vehicle.id)) {
        return prev;
      }
      if (prev.length >= 4) {
        alert("You can compare a maximum of 4 vehicles at a time.");
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const removeFromCompare = (vehicleId) => {
    setCompareList(prev => prev.filter(v => v.id !== vehicleId));
  };

  const isInCompare = (vehicleId) => {
    return compareList.some(v => v.id === vehicleId);
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      isCompareOpen,
      setIsCompareOpen
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
