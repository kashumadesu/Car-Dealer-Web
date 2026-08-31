import React, { useState, useMemo, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Car, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import HeroSection from './HeroSection';
import CategoryExplorer from './CategoryExplorer';
import FilterSidebar from './FilterSidebar';
import VehicleCard from './VehicleCard';

export default function VehicleShowcase({ 
  vehicles, 
  categories, 
  onSelectVehicle, 
  onOpenChat,
  selectedCategory,
  setSelectedCategory 
}) {
  const [filters, setFilters] = useState({
    category: selectedCategory || 'all',
    brand: 'all',
    transmission: 'all',
    fuelType: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    status: 'AVAILABLE'
  });

  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync prop changes
  useEffect(() => {
    if (selectedCategory) {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      transmission: 'all',
      fuelType: 'all',
      minPrice: '',
      maxPrice: '',
      search: '',
      status: 'AVAILABLE'
    });
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  const handleHeroSearch = (searchParams) => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.category || 'all',
      transmission: searchParams.transmission || 'all',
      fuelType: searchParams.fuelType || 'all',
      minPrice: searchParams.minPrice || '',
      maxPrice: searchParams.maxPrice || ''
    }));
    setCurrentPage(1);
  };

  // Filter and Sort Processing
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Status filter
      if (filters.status === 'AVAILABLE' && v.status !== 'AVAILABLE') return false;
      // Category filter
      if (filters.category && filters.category !== 'all' && v.categoryId.toLowerCase() !== filters.category.toLowerCase()) return false;
      // Transmission
      if (filters.transmission && filters.transmission !== 'all' && v.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
      // Fuel Type
      if (filters.fuelType && filters.fuelType !== 'all' && v.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
      // Price
      if (filters.minPrice && v.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && v.price > Number(filters.maxPrice)) return false;
      // Keyword search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match = v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.variant.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'mileage-low') return a.mileage - b.mileage;
      if (sortBy === 'year-new') return b.year - a.year;
      return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    });
  }, [vehicles, filters, sortBy]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-0 text-left">
      {/* Hero Section */}
      <HeroSection 
        onSearch={handleHeroSearch} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setFilters(prev => ({ ...prev, category: cat }));
        }} 
      />

      {/* Category Explorer */}
      <CategoryExplorer
        categories={categories}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setFilters(prev => ({ ...prev, category: cat }));
          setCurrentPage(1);
          const catalogEl = document.getElementById('catalog-section');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Showroom Catalog Section */}
      <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Filter Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              availableCount={filteredVehicles.length}
              totalCount={vehicles.length}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Inventory Grid */}
          <div className="flex-1 w-full space-y-6">
            {/* Catalog Top Action Bar */}
            <div className="bg-white p-5 rounded-2xl border-2 border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight flex items-center space-x-2.5">
                  <span>Available Showroom Inventory</span>
                  <span className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-full font-bold">
                    {filteredVehicles.length} Units Found
                  </span>
                </h3>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 border-2 border-zinc-300 text-zinc-900 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-rose-500"
                >
                  <option value="newest">Featured & New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="mileage-low">Lowest Mileage</option>
                  <option value="year-new">Latest Year Model</option>
                </select>
              </div>
            </div>

            {/* Vehicles Cards Grid */}
            {paginatedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelectVehicle={onSelectVehicle}
                    onOpenChat={onOpenChat}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-zinc-200 p-16 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
                  <Car className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900">No Vehicles Match Your Search Filters</h4>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                  Try adjusting your budget slider or clearing the transmission/category filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-md uppercase tracking-wider"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl border-2 border-zinc-300 bg-white text-zinc-700 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(idx + 1);
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-white border-2 border-zinc-300 text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl border-2 border-zinc-300 bg-white text-zinc-700 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
