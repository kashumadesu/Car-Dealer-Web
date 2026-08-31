import React from 'react';
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Share2
} from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900 mt-20">
      {/* Official Facebook Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Follow Our Official Facebook Page</h3>
              <p className="text-xs text-zinc-400">Get instant updates on fresh showroom arrivals, promo rates, and live walkarounds.</p>
            </div>
          </div>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-5 py-3 rounded-lg shadow-sm transition-all hover:scale-105"
          >
            <span>Visit Facebook Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About Dealership */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Drive<span className="text-rose-500">Hub</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The premier controlled automotive showcase in Metro Manila. Certified inspected vehicles, transparent pricing, fast financing approvals, and hassle-free LTO transfers.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Verified Inventory</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('showroom')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-1.5 transition-colors">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span>All Vehicles</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('categories')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-1.5 transition-colors">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span>Browse Categories</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('team')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-1.5 transition-colors">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span>Our Sales Team</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('about')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-1.5 transition-colors">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span>About DriveHub</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('favorites')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-1.5 transition-colors">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span>Saved Favorites</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Dealership Hours */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4">Showroom Schedule</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200 block">Mon - Sat:</strong>
                <span>8:00 AM – 6:00 PM</span>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200 block">Sunday:</strong>
                <span>Closed (Viewing by Appointment)</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4">Contact Info</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>123 AutoHub Drive, Quezon City, Metro Manila, Philippines</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>+63 999 888 7777 / (02) 8123 4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>inquiry@drivehub.ph</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>© 2026 DriveHub Philippines. Controlled Single-Dealership Inventory Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
