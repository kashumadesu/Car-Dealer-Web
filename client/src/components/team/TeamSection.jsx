import React from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  ExternalLink, 
  MessageSquare, 
  ShieldCheck,
  Share2
} from 'lucide-react';

export default function TeamSection({ employees, onOpenChat }) {
  return (
    <div className="py-12 bg-zinc-50 min-h-[80vh] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Authorized Dealership Personnel</span>
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Meet Our Professional Sales & Support Team
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Transparent transactions start with certified people. Connect directly with our team for unit viewings, bank loan approvals, and trade-in appraisals.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo & Online Status */}
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                  <img
                    src={emp.profileImage}
                    alt={emp.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {emp.isOnline && (
                    <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Available for Chat</span>
                    </div>
                  )}
                </div>

                {/* Info Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">{emp.name}</h3>
                    <p className="text-xs font-semibold text-rose-600 mt-0.5">{emp.position}</p>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {emp.bio}
                  </p>

                  <div className="space-y-2 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-medium text-zinc-800">{emp.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  onClick={() => onOpenChat(null, emp)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  <span>Message {emp.name.split(' ')[0]}</span>
                </button>

                {emp.facebookUrl && (
                  <a
                    href={emp.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Share2 className="w-3 h-3 text-zinc-500" />
                    <span>Official Facebook Profile</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
