import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  ShieldCheck, 
  Users, 
  Headphones, 
  Award,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

export default function HeroSection({ onSearch, onSelectCategory }) {
  const [category, setCategory] = useState('all');
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
      category,
      transmission,
      fuelType,
      minPrice,
      maxPrice
    });
  };

  return (
    <div className="relative bg-zinc-950 text-white overflow-hidden border-b border-zinc-800">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/25 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-600/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Dealership Digital Showroom</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                FIND YOUR <br />
                <span className="text-rose-600">DREAM CAR</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
                Premium inspected vehicles, transparent all-in pricing, real-time inventory availability, and direct consultant messaging.
              </p>
            </div>

            {/* Quick Search Box */}
            <div className="bg-zinc-900/90 border border-zinc-800 p-4 sm:p-5 rounded-xl shadow-2xl backdrop-blur-md">
              <form onSubmit={handleQuickSearch} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Category */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                      <option value="pickup">Pickup</option>
                      <option value="mpv">MPV</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="coupe">Coupe</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1.5">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">Any Budget</option>
                      <option value="under700k">Under ₱700,000</option>
                      <option value="700k-1m">₱700k – ₱1,000,000</option>
                      <option value="above1m">Above ₱1,000,000</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1.5">Transmission</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">All</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1.5">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">All</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
                  {/* Popular tags */}
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400 overflow-x-auto w-full sm:w-auto py-1">
                    <span className="font-medium text-zinc-500">Popular:</span>
                    {['Sedan', 'SUV', 'Pickup', 'Van', 'Hatchback'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setCategory(tag.toLowerCase());
                          onSelectCategory(tag.toLowerCase());
                        }}
                        className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg shadow-rose-600/30 transition-all text-xs"
                  >
                    <Search className="w-4 h-4" />
                    <span>SEARCH CARS</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Showcase Image Hero */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"
                alt="DriveHub Featured Sports Car"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">100% Quality Inspected</h4>
                    <p className="text-[11px] text-zinc-400">Complete service records & clean papers</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Showroom Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">250+</div>
              <div className="text-xs text-zinc-400">Quality Checked Cars</div>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">7 Vehicle Types</div>
              <div className="text-xs text-zinc-400">Sedan, SUV, Van, Pickup</div>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">1,000+</div>
              <div className="text-xs text-zinc-400">Happy Clients Served</div>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">Dedicated Support</div>
              <div className="text-xs text-zinc-400">Live Chat & AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
