import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  X, 
  Search, 
  ChevronDown,
  DollarSign,
  Gauge,
  Calendar,
  Cog,
  Fuel,
  Check
} from 'lucide-react';

export default function FilterSidebar({ 
  filters, 
  setFilters, 
  categories, 
  availableCount, 
  totalCount,
  onReset 
}) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Active filter tags calculation
  const activeTags = [];
  if (filters.category && filters.category !== 'all') {
    const cat = categories.find(c => c.id === filters.category);
    activeTags.push({ key: 'category', label: `Category: ${cat ? cat.name : filters.category}` });
  }
  if (filters.brand && filters.brand !== 'all') {
    activeTags.push({ key: 'brand', label: `Brand: ${filters.brand}` });
  }
  if (filters.maxPrice) {
    activeTags.push({ key: 'maxPrice', label: `Max ₱${Number(filters.maxPrice).toLocaleString()}` });
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
    <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Filters</h3>
        </div>

        {activeTags.length > 0 && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => removeFilterTag(tag.key)}
                className="hover:bg-rose-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Keyword Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Vios, CR-V, Wildtrak..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-7 py-2 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Accordion */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-2">Category</label>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => handleFilterChange('category', 'all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              filters.category === 'all' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] text-zinc-400">{totalCount}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleFilterChange('category', c.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                filters.category === c.id ? 'bg-rose-50 text-rose-700 font-bold' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[11px] text-zinc-400">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-zinc-700">Max Budget</label>
          <span className="text-xs font-bold text-rose-600">
            {filters.maxPrice ? `₱${Number(filters.maxPrice).toLocaleString()}` : 'Any Price'}
          </span>
        </div>
        <input
          type="range"
          min="400000"
          max="2000000"
          step="50000"
          value={filters.maxPrice || 2000000}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value >= 2000000 ? '' : e.target.value)}
          className="w-full accent-rose-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>₱400k</span>
          <span>₱1.2M</span>
          <span>₱2M+</span>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-2">Transmission</label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {['all', 'Automatic', 'Manual'].map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange('transmission', t)}
              className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors ${
                filters.transmission === t
                  ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-2">Fuel Type</label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {['all', 'Gasoline', 'Diesel'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange('fuelType', f)}
              className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors ${
                filters.fuelType === f
                  ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Status */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-2">Inventory Status</label>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="statusFilter"
              checked={!filters.status || filters.status === 'AVAILABLE'}
              onChange={() => handleFilterChange('status', 'AVAILABLE')}
              className="accent-rose-600"
            />
            <span className="text-zinc-700 font-medium">Available Units Only</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="statusFilter"
              checked={filters.status === 'ALL'}
              onChange={() => handleFilterChange('status', 'ALL')}
              className="accent-rose-600"
            />
            <span className="text-zinc-700">Include Reserved & Sold Units</span>
          </label>
        </div>
      </div>
    </div>
  );
}
