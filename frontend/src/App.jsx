import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OfficerDashboard from './components/OfficerDashboard';
import GrievanceDesk from './components/GrievanceDesk';
import ServiceDesk from './components/ServiceDesk';
import KisanMandi from './components/KisanMandi';
import NoticeHealth from './components/NoticeHealth';
import { api } from './api';
import { 
  AlertCircle, FileText, Sprout, HeartPulse, 
  Building2, Users, Phone, ShieldCheck, RefreshCw 
} from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('villager'); // 'villager' | 'officer'
  const [villagerTab, setVillagerTab] = useState('grievances'); // 'grievances' | 'services' | 'mandi' | 'health'
  const [lang, setLang] = useState('hi'); // 'hi' | 'en'
  const isHi = lang === 'hi';

  const [summary, setSummary] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [services, setServices] = useState([]);
  const [mandiRates, setMandiRates] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [healthSchedules, setHealthSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [sumData, gData, sData, mData, fData, nData, hData] = await Promise.all([
        api.getOfficerSummary(),
        api.getGrievances(),
        api.getServices(),
        api.getMandiRates(),
        api.getFertilizers(),
        api.getNotices(),
        api.getHealthSchedules(),
      ]);

      if (sumData) setSummary(sumData);
      if (gData && Array.isArray(gData)) setGrievances(gData);
      if (sData && Array.isArray(sData)) setServices(sData);
      if (mData && Array.isArray(mData)) setMandiRates(mData);
      if (fData && Array.isArray(fData)) setFertilizers(fData);
      if (nData && Array.isArray(nData)) setNotices(nData);
      if (hData && Array.isArray(hData)) setHealthSchedules(hData);
    } catch (e) {
      console.error("Failed to fetch initial data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Navigation Header */}
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        lang={lang} 
        setLang={setLang}
        urgentNoticeCount={notices.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick Context Bar for Villager Mode */}
        {activeRole === 'villager' && (
          <div className="mb-6">
            {/* Tab Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setVillagerTab('grievances')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  villagerTab === 'grievances'
                    ? 'bg-emerald-800 text-white shadow-emerald-800/20'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'समस्या निवारण (हैंडपंप, पानी, बिजली)' : 'Civic Grievance Hotline'}</span>
                <span className="bg-emerald-950/40 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded-full">
                  {grievances.length}
                </span>
              </button>

              <button
                onClick={() => setVillagerTab('services')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  villagerTab === 'services'
                    ? 'bg-sky-800 text-white shadow-sky-800/20'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-300" />
                <span>{isHi ? 'प्रमाण पत्र एवं पेंशन डेस्क' : 'Certificates & Pension Desk'}</span>
                <span className="bg-sky-950/40 text-sky-200 text-[10px] px-1.5 py-0.2 rounded-full">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setVillagerTab('mandi')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  villagerTab === 'mandi'
                    ? 'bg-amber-800 text-white shadow-amber-800/20'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <Sprout className="w-4 h-4 text-amber-300" />
                <span>{isHi ? 'मंडी भाव व खाद स्टॉक' : 'Mandi Rates & Fertilizer'}</span>
                <span className="bg-amber-950/40 text-amber-200 text-[10px] px-1.5 py-0.2 rounded-full">
                  Live
                </span>
              </button>

              <button
                onClick={() => setVillagerTab('health')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  villagerTab === 'health'
                    ? 'bg-teal-800 text-white shadow-teal-800/20'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>{isHi ? 'डॉक्टर सारणी व सूचना पट्ट' : 'Doctor OPD & Notice Board'}</span>
                <span className="bg-teal-950/40 text-teal-200 text-[10px] px-1.5 py-0.2 rounded-full">
                  {notices.length}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* View Switcher: Officer vs Villager */}
        {activeRole === 'officer' ? (
          <OfficerDashboard 
            summary={summary}
            grievances={grievances}
            services={services}
            fertilizers={fertilizers}
            refreshData={loadAllData}
            lang={lang}
          />
        ) : (
          <div>
            {villagerTab === 'grievances' && (
              <GrievanceDesk 
                grievances={grievances} 
                refreshData={loadAllData} 
                lang={lang} 
              />
            )}
            {villagerTab === 'services' && (
              <ServiceDesk 
                services={services} 
                refreshData={loadAllData} 
                lang={lang} 
              />
            )}
            {villagerTab === 'mandi' && (
              <KisanMandi 
                mandiRates={mandiRates} 
                fertilizers={fertilizers} 
                lang={lang} 
              />
            )}
            {villagerTab === 'health' && (
              <NoticeHealth 
                notices={notices} 
                healthSchedules={healthSchedules} 
                lang={lang} 
              />
            )}
          </div>
        )}
      </main>

      {/* Village Emergency Helpline Footer */}
      <footer className="mt-12 bg-stone-900 text-white border-t border-stone-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌾</span>
                <h4 className="font-extrabold text-white text-base">GramSeva</h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {isHi 
                  ? 'भारतीय ग्रामीण क्षेत्र हेतु एकीकृत समाधान पोर्टल। बिना किसी जटिलता, 1 दृश्य में नागरिक एवं अधिकारी समस्याओं का निस्तारण।' 
                  : 'Integrated smart governance and problem redressal system for Indian Gram Panchayats.'}
              </p>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-amber-400 mb-2">
                {isHi ? 'ग्राम पंचायत कार्यालय' : 'Panchayat Office'}
              </h5>
              <p className="text-xs text-stone-400 space-y-1">
                <span className="block">📍 Panchayat Bhavan, Ward 1</span>
                <span className="block">📞 Secretary / Sachiv: 9826011223</span>
                <span className="block">⏰ Mon - Sat: 10:00 AM - 5:00 PM</span>
              </p>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-2">
                {isHi ? 'आपातकालीन राष्ट्रीय हेल्पलाइन' : 'National Helplines'}
              </h5>
              <div className="text-xs text-stone-400 space-y-1">
                <p>🚨 CM Citizen Helpline: <strong className="text-white">181</strong></p>
                <p>🌾 Kisan Call Centre: <strong className="text-white">1800-180-1551</strong></p>
                <p>🚑 Ambulance / Medical: <strong className="text-white">108</strong></p>
                <p>⚡ Electricity Breakdown: <strong className="text-white">1912</strong></p>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 mb-2">
                {isHi ? 'तकनीकी वास्तुकला' : 'Architecture'}
              </h5>
              <p className="text-xs text-stone-400">
                Frontend: <span className="text-white font-medium">React.js + Tailwind</span><br />
                Backend: <span className="text-white font-medium">Django + DRF</span><br />
                Database: <span className="text-white font-medium">Django Default SQLite</span><br />
                Design: <span className="text-white font-medium">1-Click / Zero AI Prompt</span>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} GramSeva · Designed for Indian Villages & Local Governance
          </div>
        </div>
      </footer>
    </div>
  );
}
