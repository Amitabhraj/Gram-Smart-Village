import React, { useState } from 'react';
import { 
  Building2, AlertTriangle, CheckCircle, Clock, IndianRupee, 
  MapPin, Send, Filter, RefreshCw, Award, ArrowUpRight, ShieldCheck,
  FileCheck, Users, Megaphone, Check
} from 'lucide-react';
import { api } from '../api';

export default function OfficerDashboard({ 
  summary, 
  grievances, 
  services, 
  fertilizers, 
  refreshData,
  lang 
}) {
  const isHi = lang === 'hi';
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [activeTab, setActiveTab] = useState('grievances'); // 'grievances' | 'services' | 'broadcast'
  const [updatingId, setUpdatingId] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Quick action local edits
  const [actionState, setActionState] = useState({});

  // Broadcast state
  const [broadcast, setBroadcast] = useState({
    title: '',
    category: 'WATER_SUPPLY',
    priority: 'HIGH',
    event_date: '',
    venue: '',
    description: ''
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const metrics = summary?.metrics || {
    total_grievances: grievances.length,
    pending_grievances: grievances.filter(g => g.status === 'PENDING').length,
    in_progress: grievances.filter(g => g.status === 'IN_PROGRESS').length,
    resolved_grievances: grievances.filter(g => g.status === 'RESOLVED').length,
    critical_unresolved: grievances.filter(g => (g.urgency === 'URGENT' || g.urgency === 'CRITICAL') && g.status !== 'RESOLVED').length,
    total_funds_sanctioned: grievances.reduce((sum, g) => sum + (g.funds_allocated || 0), 0),
    pending_applications: services.filter(s => s.status === 'SUBMITTED' || s.status === 'UNDER_VERIFICATION').length,
    approved_applications: services.filter(s => s.status === 'APPROVED' || s.status === 'READY_FOR_PICKUP').length,
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // 1-Click Status change for Grievance
  const handleQuickGrievanceUpdate = async (id, newStatus, assignedTo, funds, notes) => {
    setUpdatingId(id);
    try {
      await api.updateGrievanceAction(id, {
        status: newStatus,
        assigned_to: assignedTo,
        funds_allocated: funds,
        notes: notes || `Action updated to ${newStatus} by Panchayat Officer`
      });
      showToast(isHi ? `शिकायत #${id} की स्थिति सफलतापूर्वक अपडेट की गई!` : `Grievance #${id} updated in 1 click!`);
      await refreshData();
    } catch (e) {
      alert("Error updating action");
    } finally {
      setUpdatingId(null);
    }
  };

  // 1-Click Decision for Certificates
  const handleServiceDecision = async (id, decision, remarks) => {
    setUpdatingId(id);
    try {
      await api.updateServiceDecision(id, {
        status: decision,
        remarks: remarks || `Status set to ${decision} by Village Officer`,
        appointment_date: decision === 'APPROVED' ? 'Digital Seal Stamped & Approved' : 'Scheduled at Panchayat Bhavan'
      });
      showToast(isHi ? `आवेदन स्वीकृत एवं सील सत्यापित!` : `Service Application updated successfully!`);
      await refreshData();
    } catch (e) {
      alert("Error updating decision");
    } finally {
      setUpdatingId(null);
    }
  };

  // Publish Notice
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcast.title || !broadcast.description) return;
    setIsPublishing(true);
    try {
      await api.createNotice(broadcast);
      showToast(isHi ? 'ग्राम सूचना बोर्ड पर घोषणा जारी की गई!' : 'Village announcement published live!');
      setBroadcast({
        title: '',
        category: 'WATER_SUPPLY',
        priority: 'HIGH',
        event_date: '',
        venue: '',
        description: ''
      });
      await refreshData();
    } catch (e) {
      alert("Error publishing notice");
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    if (selectedWard === 'ALL') return true;
    return g.ward.includes(selectedWard);
  });

  return (
    <div className="space-y-6">
      {/* Toast banner */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Banner & Context */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs px-3 py-1 rounded-full font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                {isHi ? 'अधिकारी वन-क्लिक कमांड केंद्र' : 'Officer 1-View Command Center'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isHi ? 'ग्राम पंचायत नियंत्रण पट्ट' : 'Panchayat Operational Command'}
              </h2>
              <p className="text-stone-300 text-sm max-w-2xl mt-1">
                {isHi 
                  ? 'बिना किसी जटिल AI प्राम्प्ट या कागजी रजिस्टर के, पूरे गांव की समस्याओं का 1 दृश्य में त्वरित निस्तारण।' 
                  : 'Zero AI prompts or research needed. Real-time civic radar, 1-click approvals, fund sanctions, and bottleneck management.'}
              </p>
            </div>
            
            <button
              onClick={refreshData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-semibold text-white transition border border-white/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isHi ? 'डेटा रीफ्रेश' : 'Sync Live Data'}</span>
            </button>
          </div>

          {/* 1-View Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-stone-300 text-xs font-medium mb-1">
                <span>{isHi ? 'अति-आवश्यक आपात' : 'Critical Alerts'}</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400">
                {metrics.critical_unresolved}
              </div>
              <span className="text-[11px] text-stone-400">
                {isHi ? 'तत्काल ध्यान अपेक्षित' : 'Needs immediate sanction'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-stone-300 text-xs font-medium mb-1">
                <span>{isHi ? 'स्वीकृत राहत बजट' : 'Funds Sanctioned'}</span>
                <IndianRupee className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">
                ₹{metrics.total_funds_sanctioned.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-stone-400">
                {isHi ? 'मोटर/लाइट/पाइपलाइन मरम्मत' : 'Repair allocations'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-stone-300 text-xs font-medium mb-1">
                <span>{isHi ? 'लंबित प्रमाण पत्र' : 'Pending Certificates'}</span>
                <FileCheck className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-sky-300">
                {metrics.pending_applications}
              </div>
              <span className="text-[11px] text-stone-400">
                {isHi ? '1-क्लिक डिजिटल मुहर योग्य' : 'Awaiting digital seal'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-stone-300 text-xs font-medium mb-1">
                <span>{isHi ? 'कुल निस्तारित' : 'Total Resolved'}</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                {metrics.resolved_grievances} / {metrics.total_grievances}
              </div>
              <span className="text-[11px] text-stone-400">
                {isHi ? 'सफलता दर' : 'Resolution rate'}: {Math.round((metrics.resolved_grievances / (metrics.total_grievances || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Ward Bottleneck Radar & Cooperative Fertilizer Alert (1-View Officer Insight) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ward Bottlenecks */}
        <div className="md:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {isHi ? 'वार्ड-वार समस्या रडार (हॉटस्पॉट)' : 'Ward Bottleneck Radar'}
              </h3>
              <p className="text-xs text-stone-500">
                {isHi 
                  ? 'अधिकारी सीधे देख सकते हैं कि किस वार्ड में काम रुका हुआ है' 
                  : 'Instantly spot which ward needs contractors without reading registers'}
              </p>
            </div>
            <div className="flex gap-1">
              {['ALL', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWard(w)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedWard === w
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Quick breakdown list */}
          <div className="space-y-2.5 mt-3">
            {[
              { ward: 'Ward 3 - Patel Mohalla', issues: 1, type: 'Water Pipeline Burst (Critical)', fund: '₹4,500' },
              { ward: 'Ward 1 - Gandhi Chowk', issues: 1, type: '25 KVA Transformer Burnt (Sanctioned)', fund: '₹28,000' },
              { ward: 'Ward 5 - Harijan Basti', issues: 1, type: 'Handpump lever broken & dirty water', fund: 'Pending' },
              { ward: 'Ward 4 - Narmada Road', issues: 1, type: 'Drainage culvert cracked', fund: 'Pending' },
              { ward: 'Ward 2 - Purana Thana', issues: 1, type: 'Street lights solar battery', fund: 'Resolved' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-stone-900 block">{item.ward}</span>
                    <span className="text-stone-500 text-[11px]">{item.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    item.fund === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    item.fund === 'Pending' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.fund}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local PACS Fertilizer & Supply Alert */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                🌾 {isHi ? 'सहकारी खाद गोदाम स्थिति' : 'PACS Fertilizer Inventory'}
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {isHi ? 'लाइव' : 'Live'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              {isHi 
                ? 'कृषक भीड़ व कमी से पहले अधिकारी को स्टॉक अलर्ट' 
                : 'Officer alert before farmer queues form at local society'}
            </p>

            <div className="space-y-3">
              {fertilizers.map((fert, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/50">
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-800 mb-1">
                    <span className="truncate max-w-[160px]">{fert.fertilizer_name}</span>
                    <span className="text-emerald-700 font-bold">{fert.bags_available} {isHi ? 'बोरी' : 'bags'}</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${fert.bags_available > 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (fert.bags_available / 500) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                    <span>{isHi ? 'शासकीय दर' : 'Price'}: ₹{fert.price_per_bag}</span>
                    <span>{fert.bags_available > 50 ? (isHi ? 'पर्याप्त' : 'In Stock') : (isHi ? 'सीमित' : 'Low Stock')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'सोहागपुर ब्लॉक नोडल गोदाम से सिंक' : 'Synced with Tehsil PACS warehouse'}</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher: 1-Click Action Queues */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50/70 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('grievances')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'grievances'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? 'शिकायत त्वरित निस्तारण' : '1-Click Grievance Redressal'}</span>
              <span className="bg-amber-400/20 text-amber-600 text-[10px] px-1.5 py-0.2 rounded-full">
                {filteredGrievances.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{isHi ? 'प्रमाण पत्र डिजिटल स्वीकृति' : '1-Click Certificate Desk'}</span>
              <span className="bg-sky-400/20 text-sky-600 text-[10px] px-1.5 py-0.2 rounded-full">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'broadcast'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? 'ग्राम सूचना प्रसारण' : 'Broadcast Village Notice'}</span>
            </button>
          </div>
        </div>

        {/* Content 1: Grievances 1-Click Action Table */}
        {activeTab === 'grievances' && (
          <div className="overflow-x-auto p-4 sm:p-6">
            <div className="space-y-4">
              {filteredGrievances.map((g) => {
                const isWorking = updatingId === g.id;
                return (
                  <div 
                    key={g.id} 
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-200 px-2 py-0.5 rounded">
                          {g.ticket_id}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {g.ward}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                          g.urgency === 'URGENT' ? 'bg-orange-100 text-orange-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {g.urgency}
                        </span>
                        <span className="text-xs font-bold text-stone-700">
                          {g.category}
                        </span>
                      </div>

                      <p className="text-sm text-stone-800 font-medium">
                        {g.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-stone-500 flex-wrap">
                        <span>👤 {g.citizen_name} ({g.mobile})</span>
                        {g.landmark && <span>📍 {g.landmark}</span>}
                        {g.funds_allocated > 0 && (
                          <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                            💰 Allocated: ₹{g.funds_allocated}
                          </span>
                        )}
                        {g.assigned_to && (
                          <span className="text-emerald-800 font-semibold">
                            👷 Assigned: {g.assigned_to}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 1-Click Fast Actions for Officer */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200">
                      {g.status !== 'RESOLVED' ? (
                        <>
                          <button
                            disabled={isWorking}
                            onClick={() => handleQuickGrievanceUpdate(
                              g.id, 
                              'IN_PROGRESS', 
                              'Lineman & Repair Team', 
                              g.funds_allocated || 2500,
                              'Dispatched field repair team immediately.'
                            )}
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                          >
                            <span>⚡ {isHi ? 'टीम भेजें' : 'Assign Team'}</span>
                          </button>

                          <button
                            disabled={isWorking}
                            onClick={() => handleQuickGrievanceUpdate(
                              g.id, 
                              'SANCTIONED', 
                              g.assigned_to || 'Panchayat Contractor', 
                              g.funds_allocated ? g.funds_allocated + 5000 : 5000,
                              'Emergency Panchayat repair budget sanctioned.'
                            )}
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                          >
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>{isHi ? 'बजट स्वीकृत' : 'Sanction ₹5k'}</span>
                          </button>

                          <button
                            disabled={isWorking}
                            onClick={() => handleQuickGrievanceUpdate(
                              g.id, 
                              'RESOLVED', 
                              g.assigned_to, 
                              g.funds_allocated,
                              'Field inspection completed. Problem resolved successfully.'
                            )}
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isHi ? 'निस्तारित करें' : 'Mark Resolved'}</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{isHi ? 'सफलतापूर्वक निस्तारित' : 'Resolved'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content 2: Certificates 1-Click Decision Desk */}
        {activeTab === 'services' && (
          <div className="overflow-x-auto p-4 sm:p-6">
            <div className="space-y-4">
              {services.map((s) => {
                const isWorking = updatingId === s.id;
                return (
                  <div 
                    key={s.id} 
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded">
                          {s.token_number}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {s.service_type}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          ({s.ward})
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-stone-800">
                        {s.applicant_name} <span className="font-normal text-stone-500">S/o, D/o {s.guardian_name}</span>
                      </div>

                      <p className="text-xs text-stone-600">
                        <span className="font-semibold">{isHi ? 'उद्देश्य' : 'Purpose'}:</span> {s.reason || 'Scholarship / Welfare requirement'}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span>📞 {s.mobile}</span>
                        <span>Aadhaar: **** {s.aadhaar_last_four}</span>
                        {s.officer_remarks && (
                          <span className="text-sky-800 font-medium">
                            📝 {s.officer_remarks}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 1-Click Decision Buttons */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-2 lg:pt-0">
                      {s.status !== 'APPROVED' && s.status !== 'READY_FOR_PICKUP' ? (
                        <>
                          <button
                            disabled={isWorking}
                            onClick={() => handleServiceDecision(s.id, 'APPROVED', 'Kotwar & records verified. Digitally stamped.')}
                            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{isHi ? 'डिजिटल सील व स्वीकृति' : '1-Click Approve & Seal'}</span>
                          </button>

                          <button
                            disabled={isWorking}
                            onClick={() => handleServiceDecision(s.id, 'UNDER_VERIFICATION', 'Patwari field enquiry requested.')}
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                          >
                            <span>{isHi ? 'जांच संस्तुति' : 'Verify Records'}</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            {isHi ? 'डिजिटल मुहर स्वीकृत' : 'Approved & Sealed'}
                          </span>
                          <button
                            onClick={() => alert(`Certificate token ${s.token_number} generated with digital stamp: Panchayat Pipariya`)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition"
                          >
                            {isHi ? 'प्रमाण पत्र डाउनलोड' : 'Print Certificate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content 3: Quick Broadcast Notice */}
        {activeTab === 'broadcast' && (
          <div className="p-6 max-w-2xl">
            <h4 className="font-bold text-stone-900 text-base mb-1">
              📢 {isHi ? 'तत्काल ग्राम सूचना जारी करें' : 'Publish Urgent Village Notice'}
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              {isHi 
                ? 'यह सूचना नागरिक पोर्टल, पंचायत डिस्प्ले और व्हाट्सएप अलर्ट पर तुरंत प्रसारित होगी।' 
                : 'Instantly broadcasts to Villager Portal and Panchayat board in 1 click.'}
            </p>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'सूचना शीर्षक' : 'Notice Headline'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isHi ? 'उदा. नहर में पानी छोड़ने बाबत / टीका शिविर' : 'e.g., Canal water release schedule / Free medical camp'}
                  value={broadcast.title}
                  onChange={e => setBroadcast({ ...broadcast, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isHi ? 'श्रेणी' : 'Category'}
                  </label>
                  <select
                    value={broadcast.category}
                    onChange={e => setBroadcast({ ...broadcast, category: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="WATER_SUPPLY">Water Supply / पेयजल</option>
                    <option value="HEALTH_CAMP">Health Camp / स्वास्थ्य शिविर</option>
                    <option value="GRAM_SABHA">Gram Sabha / ग्राम सभा</option>
                    <option value="ELECTRICITY">Electricity / विद्युत आपूर्ति</option>
                    <option value="WELFARE_SCHEME">Govt Scheme / कल्याणकारी योजना</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isHi ? 'दिनांक / समय' : 'Date & Venue'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow at 10 AM, Panchayat Bhavan"
                    value={broadcast.event_date}
                    onChange={e => setBroadcast({ ...broadcast, event_date: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'विस्तृत विवरण' : 'Announcement Description'}
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder={isHi ? 'ग्रामीणों के लिए आवश्यक निर्देश...' : 'Details for villagers...'}
                  value={broadcast.description}
                  onChange={e => setBroadcast({ ...broadcast, description: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{isPublishing ? 'Publishing...' : (isHi ? 'तुरंत प्रसारित करें (1-Click)' : 'Broadcast Live Now')}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
