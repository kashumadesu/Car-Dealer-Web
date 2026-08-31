import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  X, 
  Search
} from 'lucide-react';

export default function FilterSidebar({ 
  filters, 
  setFilters, 
  onReset 
}) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeTags = [];
  if (filters.maxPrice) {
    activeTags.push({ key: 'maxPrice', label: `≤ ₱${Number(filters.maxPrice).toLocaleString()}` });
  }
  if (filters.transmission && filters.transmission !== 'all') {
    activeTags.push({ key: 'transmission', label: filters.transmission });
  }
  if (filters.fuelType && filters.fuelType !== 'all') {
    activeTags.push({ key: 'fuelType', label: filters.fuelType });
  }
  if (filters.search) {
    activeTags.push({ key: 'search', label: `"${filters.search}"` });
  }

  const removeFilterTag = (key) => {
    if (key === 'maxPrice' || key === 'minPrice' || key === 'search') {
      setFilters(prev => ({ ...prev, [key]: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: 'all' }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4 text-left shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
        <div className="flex items-center space-x-1.5">
          <Filter className="w-4 h-4 text-rose-600" />
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Filters</h3>
        </div>

        {activeTags.length > 0 && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Tags */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => removeFilterTag(tag.key)}
                className="hover:bg-rose-200 rounded-full p-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Keyword Search */}
      <div>
        <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Search Showroom</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Vios, CR-V, Ranger..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-7 pr-6 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Budget / Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="font-bold text-zinc-600 uppercase text-[11px]">Budget Limit</span>
          <span className="font-bold text-rose-600">
            {filters.maxPrice ? `≤ ₱${Number(filters.maxPrice).toLocaleString()}` : 'Any Price'}
          </span>
        </div>
        <input
          type="range"
          min="500000"
          max="2000000"
          step="50000"
          value={filters.maxPrice || 2000000}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value >= 2000000 ? '' : e.target.value)}
          className="w-full accent-rose-600 cursor-pointer h-1.5 bg-zinc-200 rounded"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
          <span>₱500k</span>
          <span>₱1.2M</span>
          <span>₱2M+</span>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Transmission</label>
        <div className="grid grid-cols-3 gap-1 text-xs font-medium">
          {['all', 'Automatic', 'Manual'].map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange('transmission', t)}
              className={`py-1 px-1 rounded border text-center transition-colors text-[11px] ${
                filters.transmission === t
                  ? 'border-rose-600 bg-rose-600 text-white font-bold'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {t === 'all' ? 'All' : t === 'Automatic' ? 'Auto' : 'Manual'}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Fuel Type</label>
        <div className="grid grid-cols-3 gap-1 text-xs font-medium">
          {['all', 'Gasoline', 'Diesel'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange('fuelType', f)}
              className={`py-1 px-1 rounded border text-center transition-colors text-[11px] ${
                filters.fuelType === f
                  ? 'border-rose-600 bg-rose-600 text-white font-bold'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {f === 'all' ? 'All' : f === 'Gasoline' ? 'Gas' : 'Diesel'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
