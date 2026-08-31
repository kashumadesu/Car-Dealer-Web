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
  Share2,
  Award,
  CreditCard,
  RefreshCw,
  Headphones
} from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800 select-none">
      {/* 4 Value Proposition Cards Integrated Smoothly into Dark Footer */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="flex items-center space-x-4 bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quality Inspected</h4>
              <p className="text-xs text-zinc-400">150-point technical checked</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Easy Financing</h4>
              <p className="text-xs text-zinc-400">Flexible 20% downpayment</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Fair Trade-In</h4>
              <p className="text-xs text-zinc-400">Instant on-the-spot appraisal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Direct Support</h4>
              <p className="text-xs text-zinc-400">Live chat with sales agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Facebook Follow Section */}
      <div className="border-b border-zinc-900 py-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Follow Our Official Facebook Page</h3>
              <p className="text-xs text-zinc-400">Stay updated on newly arrived units, pricing drops, and walkaround videos.</p>
            </div>
          </div>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            <span>Visit Facebook Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Drive<span className="text-rose-500">Hub</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The premier controlled digital car showroom in Metro Manila. Certified pre-owned vehicles, transparent pricing, and direct consultant messaging.
          </p>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Certified Dealership Inventory</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <button onClick={() => setActiveTab('showroom')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-2 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>Showroom Inventory</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('categories')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-2 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>Vehicle Categories</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('team')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-2 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>Our Sales Consultants</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('about')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-2 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>About DriveHub</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('favorites')} className="text-zinc-400 hover:text-rose-400 flex items-center space-x-2 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>Saved Favorites</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Operating Schedule */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Showroom Schedule</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-zinc-400">
            <li className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200 block font-bold">Monday to Saturday:</strong>
                <span>8:00 AM – 6:00 PM</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200 block font-bold">Sunday:</strong>
                <span>Closed (Viewing by Appointment)</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact Info</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-zinc-400">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>123 AutoHub Drive, Quezon City, Metro Manila, Philippines</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>+63 999 888 7777 / (02) 8123 4567</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>inquiry@drivehub.ph</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>© 2026 DriveHub Philippines. Controlled Automotive Showroom Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
