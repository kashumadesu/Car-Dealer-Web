import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  X, 
  Search, 
  ChevronDown
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
    <div className="bg-white rounded-2xl border-2 border-zinc-200 p-6 space-y-6 text-left shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-black text-zinc-900 uppercase tracking-tight">Filter Inventory</h3>
        </div>

        {activeTags.length > 0 && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => removeFilterTag(tag.key)}
                className="hover:bg-rose-200 rounded-full p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Keyword Search Input */}
      <div>
        <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Search Showroom</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Vios, CR-V, Ranger, SUV..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-zinc-50 border-2 border-zinc-300 rounded-xl pl-9 pr-8 py-2.5 text-sm text-zinc-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div>
        <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Category</label>
        <div className="space-y-1.5 text-sm font-medium">
          <button
            onClick={() => handleFilterChange('category', 'all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.category === 'all' ? 'bg-rose-600 text-white font-bold' : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <span>All Categories</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${filters.category === 'all' ? 'bg-white text-rose-600 font-black' : 'bg-zinc-100 text-zinc-500'}`}>
              {totalCount}
            </span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleFilterChange('category', c.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                filters.category === c.id ? 'bg-rose-600 text-white font-bold' : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <span>{c.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${filters.category === c.id ? 'bg-white text-rose-600 font-black' : 'bg-zinc-100 text-zinc-500'}`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Max Budget</label>
          <span className="text-sm font-black text-rose-600">
            {filters.maxPrice ? `₱${Number(filters.maxPrice).toLocaleString()}` : 'Any Price'}
          </span>
        </div>
        <input
          type="range"
          min="500000"
          max="2000000"
          step="50000"
          value={filters.maxPrice || 2000000}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value >= 2000000 ? '' : e.target.value)}
          className="w-full accent-rose-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
        />
        <div className="flex justify-between text-xs text-zinc-500 font-semibold mt-1">
          <span>₱500k</span>
          <span>₱1.2M</span>
          <span>₱2M+</span>
        </div>
      </div>

      {/* Transmission Selector */}
      <div>
        <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Transmission</label>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          {['all', 'Automatic', 'Manual'].map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange('transmission', t)}
              className={`py-2 px-2 rounded-lg border-2 text-center transition-colors ${
                filters.transmission === t
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type Selector */}
      <div>
        <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Fuel Type</label>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          {['all', 'Gasoline', 'Diesel'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange('fuelType', f)}
              className={`py-2 px-2 rounded-lg border-2 text-center transition-colors ${
                filters.fuelType === f
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Status */}
      <div className="pt-2 border-t border-zinc-200">
        <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2.5">Status</label>
        <div className="space-y-2 text-xs font-semibold">
          <label className="flex items-center space-x-2.5 cursor-pointer text-zinc-800">
            <input
              type="radio"
              name="statusFilter"
              checked={!filters.status || filters.status === 'AVAILABLE'}
              onChange={() => handleFilterChange('status', 'AVAILABLE')}
              className="accent-rose-600 w-4 h-4"
            />
            <span>Available Showroom Units Only</span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer text-zinc-600">
            <input
              type="radio"
              name="statusFilter"
              checked={filters.status === 'ALL'}
              onChange={() => handleFilterChange('status', 'ALL')}
              className="accent-rose-600 w-4 h-4"
            />
            <span>Include Reserved & Sold Units</span>
          </label>
        </div>
      </div>
    </div>
  );
}
