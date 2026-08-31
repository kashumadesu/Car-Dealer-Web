import React, { useState, useMemo, useEffect } from 'react';
import { 
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

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (filters.status === 'AVAILABLE' && v.status !== 'AVAILABLE') return false;
      if (filters.category && filters.category !== 'all' && v.categoryId.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.transmission && filters.transmission !== 'all' && v.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
      if (filters.fuelType && filters.fuelType !== 'all' && v.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
      if (filters.minPrice && v.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && v.price > Number(filters.maxPrice)) return false;
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
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Showroom Catalog */}
      <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Filter Sidebar - Compact 250px */}
          <div className="w-full lg:w-60 xl:w-64 shrink-0">
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
          <div className="flex-1 w-full space-y-4">
            {/* Top Bar */}
            <div className="bg-white px-4 py-3 rounded-xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center space-x-2">
                  <span>Available Inventory</span>
                  <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 font-bold">
                    {filteredVehicles.length} Units
                  </span>
                </h3>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
                >
                  <option value="newest">Featured & Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="mileage-low">Lowest Mileage</option>
                  <option value="year-new">Latest Year Model</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid - Airy 3-Column Layout */}
            {paginatedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
              <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
                  <Car className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">No Vehicles Found</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try adjusting your budget or selecting a different category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1.5 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(idx + 1);
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
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
                  className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
