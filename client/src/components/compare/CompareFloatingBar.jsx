import React from 'react';
import { GitCompare, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export default function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare, setIsCompareOpen, isCompareOpen } = useCompare();

  if (compareList.length === 0 || isCompareOpen) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center space-x-4 max-w-2xl w-[92%] sm:w-auto animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center space-x-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
          <GitCompare className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold block leading-tight">Compare ({compareList.length}/4)</span>
          <span className="text-[10px] text-zinc-400">Side-by-side specs</span>
        </div>
      </div>

      {/* Selected Vehicles Thumbnails Strip */}
      <div className="hidden sm:flex items-center space-x-2 overflow-x-auto max-w-xs">
        {compareList.map((car) => (
          <div key={car.id} className="relative group shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg p-1 pr-2 flex items-center space-x-1.5 text-xs">
            <img src={car.images?.[0]} alt={car.model} className="w-8 h-6 rounded object-cover" />
            <span className="text-[11px] font-semibold text-zinc-200 truncate max-w-[80px]">{car.model}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromCompare(car.id);
              }}
              className="text-zinc-500 hover:text-rose-400 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={() => setIsCompareOpen(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition-colors flex items-center space-x-1.5 uppercase tracking-wider"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={clearCompare}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          title="Clear Compare"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
