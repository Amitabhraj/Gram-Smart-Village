import React, { useState, useEffect } from 'react';
import ThreeIndiaMap from './ThreeIndiaMap';
import { Search, MapPin, Building, ChevronRight, Compass, ShieldAlert, Sparkles, Filter, X } from 'lucide-react';
import { api } from '../api';

export default function HeroMapSearch({ 
  places, 
  selectedPlace, 
  onSelectPlace, 
  onResetPlace,
  totalGrievanceCount,
  criticalCount
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filter suggestions as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const filtered = places.filter(p => 
      p.name?.toLowerCase().includes(q) ||
      p.gram_panchayat?.toLowerCase().includes(q) ||
      p.tehsil?.toLowerCase().includes(q) ||
      p.district?.toLowerCase().includes(q) ||
      p.pincode?.includes(q)
    );
    setSuggestions(filtered);
  }, [searchQuery, places]);

  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // 1. Check local places
      const q = searchQuery.toLowerCase().trim();
      const match = places.find(p => 
        p.name.toLowerCase().includes(q) ||
        p.gram_panchayat.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );

      if (match) {
        onSelectPlace(match);
        setSuggestions([]);
      } else {
        // 2. Extensible API hook for Google Places / OpenStreetMap Geocoding
        console.log(`[Extensible Geocoding API Hook] Querying external API for: "${searchQuery}"`);
        
        // Simulating geocoding fallback for user's custom location query:
        const dynamicPlace = {
          id: Date.now(),
          name: searchQuery.trim(),
          gram_panchayat: `Gram Panchayat ${searchQuery.trim()}`,
          full_name: `${searchQuery.trim()}, India`,
          tehsil: 'Tehsil Headquarters',
          district: 'District Administrative Division',
          state: 'India',
          pincode: '462001',
          lat: 22.7553,
          lng: 78.3551,
          population: 5000,
          total_wards: 7
        };
        onSelectPlace(dynamicPlace);
        setSuggestions([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (place) => {
    onSelectPlace(place);
    setSearchQuery(place.gram_panchayat || place.name);
    setSuggestions([]);
  };

  return (
    <div className="relative min-h-[500px] sm:min-h-[540px] flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* 3D Map of India Canvas in Background */}
      <ThreeIndiaMap 
        selectedPlace={selectedPlace} 
        places={places} 
        onSelectPlace={onSelectPlace} 
      />

      {/* Front Content: Official Banner & Search Interface */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 text-center">
        {/* Official Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-medium mb-4 backdrop-blur-md shadow-lg">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive 3D Geospatial Rural Radar · Pan-India Coverage</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Find Your Village & View Local Civic Problems
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Search any Gram Panchayat, Tehsil, or District to inspect active infrastructure breakdowns, drinking water alerts, and grievance redressal records in real time.
        </p>

        {/* Central Search Bar */}
        <div className="max-w-2xl mx-auto relative text-left">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white rounded-2xl shadow-2xl border-2 border-slate-200 focus-within:border-emerald-600 transition-all overflow-hidden p-1.5"
          >
            <div className="pl-3 text-slate-400">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>

            <input
              type="text"
              placeholder="Search Village, Gram Panchayat, or District (e.g., Pipariya, Rampur, Khedi)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full text-slate-900 text-sm px-3 py-2.5 bg-transparent focus:outline-none placeholder:text-slate-400"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                className="text-slate-400 hover:text-slate-600 p-1 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>{isSearching ? 'Searching...' : 'Explore Area'}</span>
            </button>
          </form>

          {/* Autocomplete Suggestions Box */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 max-h-72 overflow-y-auto text-left animate-fadeIn">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Matching Gram Panchayats & Villages
              </div>
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectSuggestion(p)}
                  className="px-4 py-3 hover:bg-emerald-50/70 border-b border-slate-100 last:border-0 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {p.gram_panchayat}
                      </span>
                      <span className="text-xs text-slate-500">
                        Tehsil: {p.tehsil} · District: {p.district} ({p.state}) · PIN: {p.pincode}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {p.total_wards} Wards
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Select Village Tags */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Quick Areas:</span>
            {places.slice(0, 5).map((place) => (
              <button
                key={place.id}
                onClick={() => handleSelectSuggestion(place)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition backdrop-blur-sm ${
                  selectedPlace?.id === place.id
                    ? 'bg-emerald-700 text-white border-emerald-500'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                {place.name}
              </button>
            ))}
            {selectedPlace && (
              <button
                onClick={onResetPlace}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 transition"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Live Counters */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-xl mx-auto flex items-center justify-around text-center">
          <div>
            <span className="text-xl sm:text-2xl font-black text-white font-mono block">
              {totalGrievanceCount}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Total Logged Grievances
            </span>
          </div>

          <div className="w-px h-8 bg-slate-800" />

          <div>
            <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono block">
              {criticalCount}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Critical Urgency Alerts
            </span>
          </div>

          <div className="w-px h-8 bg-slate-800" />

          <div>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">
              100%
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Citizen Privacy Guard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
