import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  ShieldCheck, 
  Users, 
  Headphones, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function HeroSection({ onSearch }) {
  const [priceRange, setPriceRange] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [fuelType, setFuelType] = useState('all');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    let minPrice = '';
    let maxPrice = '';

    if (priceRange === 'under700k') {
      maxPrice = 700000;
    } else if (priceRange === '700k-1m') {
      minPrice = 700000;
      maxPrice = 1000000;
    } else if (priceRange === 'above1m') {
      minPrice = 1000000;
    }

    onSearch({
      category: 'all',
      transmission,
      fuelType,
      minPrice,
      maxPrice
    });

    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-600/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Dealership Digital Showroom</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                FIND YOUR <span className="text-rose-600">DREAM CAR</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                Quality verified vehicles, transparent pricing, live inventory statuses, and direct consultant support.
              </p>
            </div>

            {/* Clean 3-Field Search Bar */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg">
              <form onSubmit={handleQuickSearch} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Price Range */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Budget Limit</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-2 text-zinc-200 text-xs focus:outline-none focus:border-rose-500 font-medium"
                    >
                      <option value="all">Any Budget</option>
                      <option value="under700k">Under ₱700,000</option>
                      <option value="700k-1m">₱700k – ₱1M</option>
                      <option value="above1m">Above ₱1M</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Transmission</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-2 text-zinc-200 text-xs focus:outline-none focus:border-rose-500 font-medium"
                    >
                      <option value="all">All Transmissions</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-2 text-zinc-200 text-xs focus:outline-none focus:border-rose-500 font-medium"
                    >
                      <option value="all">All Fuel Types</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-zinc-800">
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                    <span>Instant Real-Time Filter</span>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-lg shadow transition-colors text-xs uppercase tracking-wider"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Showroom</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Showcase Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
                alt="DriveHub Vehicle"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />

              <div className="absolute bottom-3 left-3 right-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold text-white">100% Quality Inspected</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 shrink-0">
              <Car className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-base font-bold text-white leading-tight">250+</div>
              <div className="text-[11px] text-zinc-400">Quality Checked</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 shrink-0">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-base font-bold text-white leading-tight">7 Categories</div>
              <div className="text-[11px] text-zinc-400">Sedan, SUV, Van</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-base font-bold text-white leading-tight">1,000+</div>
              <div className="text-[11px] text-zinc-400">Happy Clients</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 shrink-0">
              <Headphones className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-base font-bold text-white leading-tight">24/7 Support</div>
              <div className="text-[11px] text-zinc-400">Live Chat & AI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
