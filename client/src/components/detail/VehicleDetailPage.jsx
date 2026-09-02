import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Gauge, 
  Cog, 
  Fuel, 
  Heart, 
  GitCompare, 
  MessageSquare, 
  Bot, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  Phone, 
  Mail
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

export default function VehicleDetailPage({ 
  vehicle, 
  onBack, 
  onOpenChat, 
  onOpenAiChat, 
  employees 
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { user, promptSignIn } = useAuth();

  // Financing Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTermMonths, setLoanTermMonths] = useState(36);

  if (!vehicle) return null;

  const favorited = isFavorite(vehicle.id);
  const compared = isInCompare(vehicle.id);
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ];

  const assignedAgent = employees?.[0] || {
    name: 'John Reyes',
    position: 'Sales Manager',
    phone: '+63 917 123 4567',
    email: 'john.reyes@drivehub.ph',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  };

  const principal = vehicle.price * (1 - downPaymentPercent / 100);
  const estimatedAnnualInterest = 0.085; // 8.5% annual rate
  const totalWithInterest = principal * (1 + (estimatedAnnualInterest * (loanTermMonths / 12)));
  const monthlyPayment = Math.round(totalWithInterest / loanTermMonths);
  const downPaymentAmount = Math.round(vehicle.price * (downPaymentPercent / 100));

  const handleFavoriteClick = () => {
    if (!user) {
      promptSignIn('Sign in to save this vehicle to your personal favorites.');
      return;
    }
    toggleFavorite(vehicle);
  };

  const handleChatClick = () => {
    if (!user) {
      promptSignIn('Sign in with your Name so our sales agent knows who is inquiring about this vehicle.');
      return;
    }
    onOpenChat(vehicle);
  };

  return (
    <div className="bg-zinc-50 min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Share */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => compared ? removeFromCompare(vehicle.id) : addToCompare(vehicle)}
              className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                compared 
                  ? 'bg-rose-600 text-white border-rose-600' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{compared ? 'In Compare' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={handleFavoriteClick}
              className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                favorited 
                  ? 'bg-rose-600 text-white border-rose-600' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
              <span>{favorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left 7 Columns: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 shadow-sm">
              <img
                src={images[activeImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white shadow-md ${
                  vehicle.status === 'AVAILABLE' ? 'bg-emerald-600' :
                  vehicle.status === 'RESERVED' ? 'bg-amber-500' : 'bg-zinc-700'
                }`}>
                  {vehicle.status}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 bg-zinc-950/70 text-white text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                {activeImageIndex + 1} / {images.length} Photos
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-16/10 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-rose-600 ring-2 ring-rose-600/30' 
                        : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right 5 Columns: Vehicle Purchase Header & Direct CTAs */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="uppercase font-semibold tracking-wider text-[11px] text-zinc-400">
                  {vehicle.condition}
                </span>
                <span className="flex items-center space-x-1 text-emerald-600 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guaranteed Clean Title</span>
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-sm font-medium text-zinc-500 mt-1">{vehicle.variant}</p>
              </div>

              {/* Pricing Box */}
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4">
                <div className="text-xs text-zinc-500 font-medium">DriveHub Cash / Bank PO Price</div>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-3xl font-black text-rose-600 tracking-tight">
                    ₱{vehicle.price.toLocaleString()}
                  </span>
                  {vehicle.previousPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      ₱{vehicle.previousPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-rose-700 font-medium mt-1">
                  <span>Estimated financing from ₱{monthlyPayment.toLocaleString()}/month</span>
                </p>
              </div>

              {/* Quick Specs Overview */}
              <div className="grid grid-cols-2 gap-3 py-2 text-xs text-zinc-700">
                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 flex items-center space-x-2.5">
                  <Gauge className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Mileage</span>
                    <strong className="text-zinc-900">{vehicle.mileage.toLocaleString()} km</strong>
                  </div>
                </div>

                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 flex items-center space-x-2.5">
                  <Cog className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Transmission</span>
                    <strong className="text-zinc-900">{vehicle.transmission}</strong>
                  </div>
                </div>

                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 flex items-center space-x-2.5">
                  <Fuel className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Fuel</span>
                    <strong className="text-zinc-900">{vehicle.fuelType}</strong>
                  </div>
                </div>

                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Year Model</span>
                    <strong className="text-zinc-900">{vehicle.year}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-6 border-t border-zinc-100">
              <button
                onClick={handleChatClick}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/25 transition-all text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAT WITH SALES AGENT</span>
              </button>

              <button
                onClick={() => onOpenAiChat(vehicle)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors text-xs"
              >
                <Bot className="w-4 h-4 text-rose-400" />
                <span>Ask Auto Assistant About This Unit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 pb-4 border-b border-zinc-100 mb-4">
                <FileText className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-zinc-900 uppercase tracking-tight">
                  Technical Specifications
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Brand & Model</span>
                  <span className="font-semibold text-zinc-900">{vehicle.brand} {vehicle.model}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Year Model</span>
                  <span className="font-semibold text-zinc-900">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Engine / Displacement</span>
                  <span className="font-semibold text-zinc-900">{vehicle.engine}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Transmission</span>
                  <span className="font-semibold text-zinc-900">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Fuel Type</span>
                  <span className="font-semibold text-zinc-900">{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Mileage (Odometer)</span>
                  <span className="font-semibold text-zinc-900">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Exterior Color</span>
                  <span className="font-semibold text-zinc-900">{vehicle.color}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">LTO Registration</span>
                  <span className="font-semibold text-emerald-700">{vehicle.registrationStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 uppercase tracking-tight mb-3">
                Vehicle Overview
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-zinc-900 uppercase tracking-tight mb-4">
                  Key Features & Equipment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-zinc-100">
                <Calculator className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-tight">
                  Financing Calculator
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Downpayment ({downPaymentPercent}%)</span>
                  <span className="font-bold text-zinc-900">₱{downPaymentAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Payment Term</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[24, 36, 48, 60].map((months) => (
                    <button
                      key={months}
                      onClick={() => setLoanTermMonths(months)}
                      className={`py-1.5 rounded-lg border text-center font-semibold transition-colors ${
                        loanTermMonths === months
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {months} Mos
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 text-white rounded-xl p-4 text-center">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Estimated Monthly</span>
                <span className="text-2xl font-extrabold text-rose-500 mt-1 block">
                  ₱{monthlyPayment.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">Subject to bank appraisal & approval</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Assigned Sales Representative
              </span>

              <div className="flex items-center space-x-3.5">
                <img
                  src={assignedAgent.profileImage}
                  alt={assignedAgent.name}
                  className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{assignedAgent.name}</h4>
                  <p className="text-xs text-rose-600 font-medium">{assignedAgent.position}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{assignedAgent.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{assignedAgent.email}</span>
                </div>
              </div>

              <button
                onClick={handleChatClick}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message {assignedAgent.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
