import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  ShieldCheck, 
  Users, 
  Headphones, 
  Award,
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

    // Smooth scroll down to catalog results
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-zinc-950 text-white overflow-hidden border-b border-zinc-800">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Certified Dealership Digital Showroom</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                FIND YOUR <br />
                <span className="text-rose-600">DREAM CAR</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
                Quality certified vehicles, transparent pricing, verified real-time availability, and direct consultant support.
              </p>
            </div>

            {/* Quick Search Box */}
            <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-2xl shadow-2xl backdrop-blur-md">
              <form onSubmit={handleQuickSearch} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Category */}
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-xs font-medium focus:outline-none focus:border-rose-500"
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
                    <label className="block text-zinc-300 font-bold mb-1.5">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-xs font-medium focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">Any Budget</option>
                      <option value="under700k">Under ₱700,000</option>
                      <option value="700k-1m">₱700k – ₱1,000,000</option>
                      <option value="above1m">Above ₱1,000,000</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1.5">Transmission</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-xs font-medium focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">All</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1.5">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-xs font-medium focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">All</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                  {/* Popular tags */}
                  <div className="flex items-center space-x-2 text-xs text-zinc-300 overflow-x-auto w-full sm:w-auto py-1">
                    <span className="font-bold text-zinc-400">Popular:</span>
                    {['Sedan', 'SUV', 'Pickup', 'Van', 'Hatchback'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setCategory(tag.toLowerCase());
                          onSelectCategory(tag.toLowerCase());
                          const catalogEl = document.getElementById('catalog-section');
                          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all text-xs uppercase tracking-wider"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Cars</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Showcase Hero Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"
                alt="DriveHub Featured Vehicle"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">100% Quality Inspected</h4>
                    <p className="text-xs text-zinc-400">Complete service records & verified titles</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                    Showroom Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">250+</div>
              <div className="text-xs text-zinc-400 font-medium">Quality Checked Cars</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">7 Categories</div>
              <div className="text-xs text-zinc-400 font-medium">Sedan, SUV, Van, Pickup</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">1,000+</div>
              <div className="text-xs text-zinc-400 font-medium">Happy Clients Served</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Dedicated Support</div>
              <div className="text-xs text-zinc-400 font-medium">Live Chat & AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
