import React from 'react';
import { Shield, Building2, Lock, LogOut, Search, MapPin, CheckCircle, UserCheck } from 'lucide-react';

export default function Navbar({ 
  currentOfficer, 
  onOpenOfficerLogin, 
  onOfficerLogout, 
  activeRole, 
  setActiveRole, 
  selectedPlace, 
  onResetPlace,
  onQuickTrackClick
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      {/* Official top stripe */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-[11px] text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-semibold tracking-wide">
              GOVERNMENT OF INDIA · PANCHAYATI RAJ DEPARTMENT
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              National Civic Infrastructure & Grievance Redressal Network
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onQuickTrackClick}
              className="text-slate-300 hover:text-white flex items-center gap-1 transition"
            >
              <Search className="w-3 h-3 text-emerald-400" />
              <span>Track Complaint Ticket</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-mono text-[10px]">
              NODE: LIVE MP-78
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onResetPlace}
            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-black text-lg cursor-pointer hover:border-emerald-500 transition shadow-inner"
          >
            GS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                onClick={onResetPlace}
                className="text-lg font-extrabold tracking-tight text-white cursor-pointer hover:text-emerald-300 transition"
              >
                GRAMSEVA
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase tracking-wider">
                Civic Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {selectedPlace ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedPlace.gram_panchayat || selectedPlace.name} · {selectedPlace.district}</span>
                </span>
              ) : (
                'Pan-India Village Search & Civic Resolution System'
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* If Officer is logged in */}
          {currentOfficer ? (
            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <div className="px-2.5 py-1 text-left">
                <span className="text-xs font-semibold text-white block">
                  {currentOfficer.name}
                </span>
                <span className="text-[10px] text-emerald-400 block font-mono">
                  {currentOfficer.designation} · {currentOfficer.badge}
                </span>
              </div>

              <button
                onClick={() => setActiveRole(activeRole === 'officer' ? 'villager' : 'officer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeRole === 'officer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {activeRole === 'officer' ? 'Viewing Officer Radar' : 'Open Officer Radar'}
              </button>

              <button
                onClick={onOfficerLogout}
                title="Sign out of Officer Portal"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* If not logged in as officer */
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400">
                Local Panchayat Official?
              </span>
              <button
                onClick={onOpenOfficerLogin}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Officer Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
