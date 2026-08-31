import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Car, 
  ArrowUpDown, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Award,
  CreditCard,
  RefreshCw,
  Headphones,
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
    status: 'AVAILABLE' // default to available units
  });

  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync prop changes
  React.useEffect(() => {
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
      // default newest
      return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    });
  }, [vehicles, filters, sortBy]);

  // Pagination
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
        }}
      />

      {/* Main Showroom Catalog Section */}
      <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Filter Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
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
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight flex items-center space-x-2">
                  <span>Available Inventory</span>
                  <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 font-bold">
                    {filteredVehicles.length} Units Found
                  </span>
                </h3>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="newest">Featured & Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="mileage-low">Lowest Mileage</option>
                  <option value="year-new">Latest Year Model</option>
                </select>
              </div>
            </div>

            {/* Vehicles Cards Grid */}
            {paginatedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
                  <Car className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">No Vehicles Match Your Selected Filters</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try widening your budget range or resetting specific category and transmission parameters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Value Proposition Section (Red/Black Footer Strip matching mockup) */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white py-8 border-y border-rose-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider">Quality Cars</h5>
              <p className="text-[11px] text-rose-100">Inspected & well-maintained</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider">Easy Financing</h5>
              <p className="text-[11px] text-rose-100">Flexible payment terms</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider">Trade-In Offer</h5>
              <p className="text-[11px] text-rose-100">Best value for your car</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider">After-Sales Support</h5>
              <p className="text-[11px] text-rose-100">Dedicated assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
