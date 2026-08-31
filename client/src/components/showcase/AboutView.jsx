import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Car, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  Mail,
  Building,
  FileCheck
} from 'lucide-react';

export default function AboutView({ onBrowseShowroom }) {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12 min-h-[80vh]">
      {/* Top Banner */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trusted Automotive Leadership Since 2018</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About <span className="text-rose-600">DriveHub</span> Philippines
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            DriveHub was founded to revolutionize how Filipinos discover, inspect, and purchase quality vehicles. We operate on a strictly controlled dealership model, ensuring that every vehicle published in our showroom is physically inspected, certified, and ready for immediate ownership transfer.
          </p>
        </div>
      </div>

      {/* 3 Pillars of DriveHub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Guaranteed Clean Documents</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Every vehicle undergoes a 150-point technical inspection and rigorous LTO, HPG (Highway Patrol Group), and bank encumbrance verification.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Warranty & Quality Assurance</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            We provide a 6-month engine and transmission warranty on all certified pre-owned units, giving you complete peace of mind on the road.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Fast Bank Approvals</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Our dedicated in-house financing officers partner with BDO, BPI, Security Bank, and Metrobank to secure downpayments as low as 20% within 48 hours.
          </p>
        </div>
      </div>

      {/* Showroom Visit Location Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-900">Visit Our Digital & Physical Showroom</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Our central hub features a spacious indoor viewing facility where you can inspect, test drive, and compare units with our sales managers.
          </p>

          <div className="space-y-2.5 text-xs text-zinc-700 pt-2">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>123 AutoHub Drive, Quezon City, Metro Manila, Philippines</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Monday to Saturday: 8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-rose-600 shrink-0" />
              <span>+63 999 888 7777 / (02) 8123 4567</span>
            </div>
          </div>
        </div>

        <div className="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"
            alt="DriveHub Showroom"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
