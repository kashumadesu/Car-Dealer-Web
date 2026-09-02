import React, { useState } from 'react';
import { 
  X, 
  GitCompare, 
  Trash2, 
  Check, 
  MessageSquare, 
  Plus, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export default function ComparisonModal({ onSelectVehicle, onOpenChat, onBrowseMore }) {
  const { compareList, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  if (!isCompareOpen) return null;

  const specRows = [
    { key: 'price', label: 'Cash Price', format: (val) => `₱${Number(val).toLocaleString()}` },
    { key: 'year', label: 'Year Model' },
    { key: 'mileage', label: 'Mileage', format: (val) => `${Number(val).toLocaleString()} km` },
    { key: 'transmission', label: 'Transmission' },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'engine', label: 'Engine' },
    { key: 'categoryId', label: 'Body Type', format: (val) => (val || '').toUpperCase() },
    { key: 'condition', label: 'Condition' },
    { key: 'status', label: 'Availability Status' }
  ];

  const hasDifferences = (rowKey) => {
    if (compareList.length < 2) return false;
    const firstVal = compareList[0][rowKey];
    return compareList.some(v => v[rowKey] !== firstVal);
  };

  const colCount = Math.max(compareList.length, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm select-none animate-in fade-in">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Side-by-Side Vehicle Comparison</h2>
              <p className="text-xs text-zinc-400">Comparing {compareList.length} model{compareList.length === 1 ? '' : 's'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {compareList.length > 1 && (
              <label className="flex items-center space-x-2 text-xs cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="rounded accent-rose-600"
                />
                <span>Highlight Differences</span>
              </label>
            )}

            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {compareList.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
                <GitCompare className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-800">No Vehicles Selected for Comparison</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Click the compare icon on any 2 or more vehicle cards in the showroom to evaluate their specs side-by-side.
              </p>
              <button
                onClick={() => {
                  setIsCompareOpen(false);
                  if (onBrowseMore) onBrowseMore();
                }}
                className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <span>Browse Showroom</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full">
              {/* Top Row: Vehicle Cards Summary */}
              <div className="grid grid-cols-12 gap-4 pb-6 border-b border-zinc-200">
                <div className="col-span-3 flex flex-col justify-end text-xs font-bold uppercase tracking-wider text-zinc-400 pb-2">
                  <span>Specifications</span>
                </div>

                {compareList.map((v) => (
                  <div 
                    key={v.id} 
                    className={`${
                      compareList.length === 1 ? 'col-span-9' :
                      compareList.length === 2 ? 'col-span-4 sm:col-span-4' :
                      compareList.length === 3 ? 'col-span-3' : 'col-span-2'
                    } bg-zinc-50 rounded-xl p-3 border border-zinc-200 relative flex flex-col justify-between`}
                  >
                    <button
                      onClick={() => removeFromCompare(v.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-zinc-200/80 hover:bg-rose-600 hover:text-white text-zinc-600 transition-colors z-10"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="aspect-16/10 rounded-lg overflow-hidden bg-zinc-200 mb-2">
                      <img
                        src={v.images?.[0]}
                        alt={v.model}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{v.year} {v.brand} {v.model}</h4>
                    <span className="text-sm font-black text-rose-600 block mt-0.5">₱{v.price.toLocaleString()}</span>

                    <div className="mt-2.5 space-y-1.5">
                      <button
                        onClick={() => {
                          setIsCompareOpen(false);
                          onSelectVehicle(v);
                        }}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setIsCompareOpen(false);
                          onOpenChat(v);
                        }}
                        className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center space-x-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat Agent</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Spec Rows Comparison */}
              <div className="divide-y divide-zinc-100 text-xs">
                {specRows.map((row) => {
                  const isDiff = highlightDifferences && hasDifferences(row.key);
                  return (
                    <div 
                      key={row.key} 
                      className={`grid grid-cols-12 gap-4 py-3 items-center ${
                        isDiff ? 'bg-amber-50/80 -mx-4 px-4 font-semibold' : ''
                      }`}
                    >
                      <div className="col-span-3 text-zinc-500 font-bold uppercase text-[11px]">
                        {row.label}
                      </div>
                      {compareList.map((v) => {
                        const val = v[row.key];
                        const formatted = row.format ? row.format(val) : val;
                        return (
                          <div 
                            key={v.id} 
                            className={`${
                              compareList.length === 1 ? 'col-span-9' :
                              compareList.length === 2 ? 'col-span-4' :
                              compareList.length === 3 ? 'col-span-3' : 'col-span-2'
                            } text-zinc-900 font-medium`}
                          >
                            {row.key === 'status' ? (
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white ${
                                val === 'AVAILABLE' ? 'bg-emerald-600' : 'bg-amber-500'
                              }`}>
                                {val}
                              </span>
                            ) : (
                              formatted
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
