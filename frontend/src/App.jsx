import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroMapSearch from './components/HeroMapSearch';
import AreaProblemsDossier from './components/AreaProblemsDossier';
import OfficerDashboard from './components/OfficerDashboard';
import ServiceDesk from './components/ServiceDesk';
import KisanMandi from './components/KisanMandi';
import NoticeHealth from './components/NoticeHealth';
import OfficerLoginModal from './components/OfficerLoginModal';
import ReportGrievanceModal from './components/ReportGrievanceModal';
import TrackComplaintModal from './components/TrackComplaintModal';
import { api } from './api';
import { 
  Building2, MapPin, AlertCircle, FileText, 
  Sprout, HeartPulse, Search, ShieldCheck, Lock, ArrowDown
} from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('villager'); // 'villager' | 'officer'
  const [activeNavTab, setActiveNavTab] = useState('dossier'); // 'dossier' | 'services' | 'mandi' | 'health'

  // Officer auth state
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [isOfficerLoginOpen, setIsOfficerLoginOpen] = useState(false);

  // Modals for citizens (zero login required)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // Selected place / area state (defaults to Pipariya or null for all)
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Core Data States
  const [summary, setSummary] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [services, setServices] = useState([]);
  const [mandiRates, setMandiRates] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [healthSchedules, setHealthSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dossierRef = useRef(null);

  // Check saved officer session
  useEffect(() => {
    const savedOfficer = localStorage.getItem('officer_data');
    const token = localStorage.getItem('officer_token');
    if (savedOfficer && token) {
      try {
        setCurrentOfficer(JSON.parse(savedOfficer));
      } catch (e) {
        localStorage.removeItem('officer_data');
      }
    }
  }, []);

  const loadData = async (villageFilter = '') => {
    setIsLoading(true);
    try {
      const [placesData, sumData, gData, sData, mData, fData, nData, hData] = await Promise.all([
        api.searchPlaces(),
        api.getOfficerSummary(villageFilter),
        api.getGrievances(villageFilter),
        api.getServices(),
        api.getMandiRates(),
        api.getFertilizers(),
        api.getNotices(),
        api.getHealthSchedules(),
      ]);

      if (placesData && Array.isArray(placesData)) {
        setPlaces(placesData);
        // Default select first place if none selected
        if (!selectedPlace && placesData.length > 0) {
          setSelectedPlace(placesData[0]);
        }
      }
      if (sumData) setSummary(sumData);
      if (gData && Array.isArray(gData)) setGrievances(gData);
      if (sData && Array.isArray(sData)) setServices(sData);
      if (mData && Array.isArray(mData)) setMandiRates(mData);
      if (fData && Array.isArray(fData)) setFertilizers(fData);
      if (nData && Array.isArray(nData)) setNotices(nData);
      if (hData && Array.isArray(hData)) setHealthSchedules(hData);
    } catch (e) {
      console.error("Failed to load portal data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedPlace?.name || '');
  }, [selectedPlace]);

  // Place selection handler
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setActiveNavTab('dossier');
    // Smooth scroll down to the problems section
    setTimeout(() => {
      dossierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleResetPlace = () => {
    setSelectedPlace(null);
  };

  const handleOfficerLoginSuccess = (officerData) => {
    setCurrentOfficer(officerData);
    setActiveRole('officer');
    loadData(selectedPlace?.name || '');
  };

  const handleOfficerLogout = () => {
    localStorage.removeItem('officer_token');
    localStorage.removeItem('officer_data');
    setCurrentOfficer(null);
    setActiveRole('villager');
    loadData(selectedPlace?.name || '');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Official Government Top Navigation */}
      <Navbar 
        currentOfficer={currentOfficer}
        onOpenOfficerLogin={() => setIsOfficerLoginOpen(true)}
        onOfficerLogout={handleOfficerLogout}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        selectedPlace={selectedPlace}
        onResetPlace={handleResetPlace}
        onQuickTrackClick={() => setIsTrackModalOpen(true)}
      />

      {/* Hero Section with 3D Map of India & Place Search Bar */}
      {activeRole === 'villager' && (
        <HeroMapSearch 
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          onResetPlace={handleResetPlace}
          totalGrievanceCount={grievances.length}
          criticalCount={grievances.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED').length}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={dossierRef}>
        
        {/* If Officer Radar is Active */}
        {activeRole === 'officer' ? (
          <OfficerDashboard 
            currentOfficer={currentOfficer}
            summary={summary}
            grievances={grievances}
            services={services}
            fertilizers={fertilizers}
            refreshData={() => loadData(selectedPlace?.name || '')}
            selectedPlace={selectedPlace}
          />
        ) : (
          /* Villager View (Zero Login Required) */
          <div>
            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200">
              <button
                onClick={() => setActiveNavTab('dossier')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeNavTab === 'dossier'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Area Civic Problems & Grievances</span>
                <span className="bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  {grievances.length}
                </span>
              </button>

              <button
                onClick={() => setActiveNavTab('services')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeNavTab === 'services'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Certificates & Welfare Desk</span>
                <span className="bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveNavTab('mandi')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeNavTab === 'mandi'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mandi Prices & PACS Fertilizer</span>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  Live
                </span>
              </button>

              <button
                onClick={() => setActiveNavTab('health')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeNavTab === 'health'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>Doctor OPD & Public Circulars</span>
                <span className="bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  {notices.length}
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeNavTab === 'dossier' && (
              <AreaProblemsDossier 
                selectedPlace={selectedPlace}
                grievances={grievances}
                currentOfficer={currentOfficer}
                onRefresh={() => loadData(selectedPlace?.name || '')}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenTrackModal={() => setIsTrackModalOpen(true)}
              />
            )}

            {activeNavTab === 'services' && (
              <ServiceDesk 
                services={services}
                refreshData={() => loadData(selectedPlace?.name || '')}
                selectedPlace={selectedPlace}
              />
            )}

            {activeNavTab === 'mandi' && (
              <KisanMandi 
                mandiRates={mandiRates}
                fertilizers={fertilizers}
              />
            )}

            {activeNavTab === 'health' && (
              <NoticeHealth 
                notices={notices}
                healthSchedules={healthSchedules}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <OfficerLoginModal 
        isOpen={isOfficerLoginOpen}
        onClose={() => setIsOfficerLoginOpen(false)}
        onLoginSuccess={handleOfficerLoginSuccess}
      />

      <ReportGrievanceModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedPlace={selectedPlace}
        onGrievanceCreated={() => loadData(selectedPlace?.name || '')}
      />

      <TrackComplaintModal 
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        currentOfficer={currentOfficer}
      />

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 text-slate-300 border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                  GS
                </div>
                <h4 className="font-extrabold text-white text-sm">GRAMSEVA</h4>
              </div>
              <p className="text-slate-400 leading-relaxed">
                National Rural Civic Infrastructure Redressal & E-Governance Platform. Built for Indian Gram Panchayats with privacy-first citizen tracking and 1-view officer decision command.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
                Administrative Divisions
              </h5>
              <div className="space-y-1.5 text-slate-400">
                <p>Gram Panchayat Pipariya (Ward 1 - 7)</p>
                <p>Gram Panchayat Rampur (Ward 1 - 5)</p>
                <p>Gram Panchayat Khedi (Ward 1 - 6)</p>
                <p>Semri Harchand & Mandla Rural Divisions</p>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
                Emergency Helplines
              </h5>
              <div className="space-y-1.5 text-slate-400 font-mono">
                <p>CM Citizen Call Center: 181</p>
                <p>Kisan Call Center: 1800-180-1551</p>
                <p>Medical Emergency Dispatch: 108</p>
                <p>Power Grid Emergency: 1912</p>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
                Security & Privacy
              </h5>
              <p className="text-slate-400 leading-relaxed">
                Citizen identities are automatically masked under privacy protocol. Complainer contact details are decrypted and made accessible strictly to authorized local Panchayat Officers upon credential verification.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} GramSeva · Ministry of Panchayati Raj · Government of India
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Guard v2.4</span>
              <span>·</span>
              <span>Django REST + React + Three.js 3D GIS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
