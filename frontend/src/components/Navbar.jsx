import React from 'react';
import { Shield, Users, Building2, Bell, Globe, Sparkles } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, lang, setLang, urgentNoticeCount }) {
  const isHi = lang === 'hi';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-amber-100 shadow-sm">
      {/* Top emergency notice ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl truncate">
          <span className="bg-amber-400 text-stone-900 font-bold px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider animate-pulse">
            {isHi ? 'ताजा सूचना' : 'Gram Live'}
          </span>
          <span className="truncate">
            {isHi 
              ? '📢 विशेष ग्राम सभा: 2 नवम्बर सुबह 10:30 बजे | वार्ड 3 में पेयजल टैंकर व्यवस्था जारी'
              : '📢 Special Gram Sabha: 2nd Nov at 10:30 AM | Emergency Water Tanker active in Ward 3'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-emerald-200">
            {isHi ? 'डिजिटल भारत - सशक्त ग्राम' : 'Digital India - Empowered Villages'}
          </span>
          <button 
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded transition text-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isHi ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <span className="text-2xl">🌾</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                GramSeva
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  {isHi ? 'ग्राम सेवा' : 'Smart Village'}
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {isHi ? 'ग्राम पंचायत पिपरिया (तहसील: सोहागपुर, नर्मदापुरम)' : 'Gram Panchayat Pipariya (Tehsil: Sohagpur, Narmadapuram)'}
            </p>
          </div>
        </div>

        {/* Role toggle button */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveRole('villager')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
              activeRole === 'villager'
                ? 'bg-white text-emerald-800 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? 'नागरिक पोर्टल' : 'Villager Portal'}</span>
          </button>

          <button
            onClick={() => setActiveRole('officer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
              activeRole === 'officer'
                ? 'bg-stone-900 text-amber-300 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'अधिकारी नियंत्रण कक्ष' : 'Officer Command Radar'}</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              1-Click
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
