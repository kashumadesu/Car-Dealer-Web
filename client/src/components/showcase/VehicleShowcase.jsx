import React, { useState, useMemo } from 'react';
import { 
  Car, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  UserCheck
} from 'lucide-react';
import HeroSection from './HeroSection';
import FilterSidebar from './FilterSidebar';
import VehicleCard from './VehicleCard';

export default function VehicleShowcase({ 
  vehicles, 
  categories, 
  onSelectVehicle, 
  onOpenChat,
  onNavigateCategories
}) {
  const [filters, setFilters] = useState({
    category: 'all',
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

  // 2 Spotlight Fresh Stock Cars
  const freshStockCars = useMemo(() => {
    return vehicles.filter(v => v.isNewArrival || v.isFeatured).slice(0, 2);
  }, [vehicles]);

  // Verified Deals Made / Recent Handover Deliveries (Trust Section)
  const recentDealsMade = [
    {
      id: 'deal-1',
      vehicleName: '2021 Honda CR-V 1.5 Turbo Prestige',
      price: '₱1,250,000',
      buyerLocation: 'Delivered to Quezon City',
      date: 'Delivered 2 days ago',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      financingType: '30% DP Bank Financing (BDO Approved)',
      verifiedNote: 'Clean LTO papers & transfer completed in 3 days.'
    },
    {
      id: 'deal-2',
      vehicleName: '2020 Ford Ranger Wildtrak 4x2',
      price: '₱1,080,000',
      buyerLocation: 'Handed Over in BGC, Taguig',
      date: 'Delivered last week',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      financingType: 'Cash Purchase with Free Chattel Mortgage',
      verifiedNote: '150-point inspection certificate passed.'
    },
    {
      id: 'deal-3',
      vehicleName: '2022 Mitsubishi Xpander 1.5 GLS',
      price: '₱820,000',
      buyerLocation: 'Transferred to Pasig City',
      date: 'Delivered 2 weeks ago',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      financingType: 'Fast-Approval Auto Loan (Security Bank)',
      verifiedNote: 'Trade-in credit applied for customer sedan.'
    }
  ];

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
          setFilters(prev => ({ ...prev, category: cat }));
        }} 
      />

      {/* SECTION 1: Fresh Showroom Stock (2 Spotlight Units) */}
      <div className="bg-white border-b border-zinc-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-rose-600" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight uppercase">
                  Fresh Showroom Stock
                </h2>
                <p className="text-xs text-zinc-500">Newly inspected and prepped for immediate delivery.</p>
              </div>
            </div>

            <button
              onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <span>View All Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {freshStockCars.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelectVehicle={onSelectVehicle}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Deals We Made / Verified Deliveries (Trust Section) */}
      <div className="bg-zinc-100/70 border-b border-zinc-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight uppercase">
                  Deals We Made & Verified Deliveries
                </h2>
                <p className="text-xs text-zinc-500">Real clients, certified ownership transfers, and guaranteed peace of mind.</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full w-fit">
              100% Satisfied Handover
            </span>
          </div>

          {/* 3 Handover Proof Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentDealsMade.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-zinc-100">
                    <img
                      src={deal.image}
                      alt={deal.vehicleName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center space-x-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Delivered & Closed</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 leading-snug">{deal.vehicleName}</h4>
                      <span className="text-xs font-black text-rose-600 mt-0.5 block">{deal.price}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-2">
                      <div className="flex items-center space-x-1.5 text-zinc-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{deal.buyerLocation}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-tight">{deal.financingType}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100 text-[11px] text-zinc-600 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{deal.verifiedNote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Full Showroom Catalog */}
      <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Filter Sidebar */}
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
                  <span>Showroom Catalog</span>
                  <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 font-bold">
                    {filteredVehicles.length} Units Available
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

            {/* Vehicle Grid */}
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
