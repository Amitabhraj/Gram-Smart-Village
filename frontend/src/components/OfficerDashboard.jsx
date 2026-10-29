import React, { useState } from 'react';
import { 
  Building2, AlertTriangle, CheckCircle2, Clock, IndianRupee, 
  MapPin, Send, Filter, RefreshCw, ShieldCheck, 
  FileCheck, Users, Megaphone, Check, Lock, User
} from 'lucide-react';
import { api } from '../api';

export default function OfficerDashboard({ 
  currentOfficer,
  summary, 
  grievances, 
  services, 
  fertilizers, 
  refreshData,
  selectedPlace
}) {
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [activeTab, setActiveTab] = useState('grievances'); // 'grievances' | 'services' | 'broadcast'
  const [updatingId, setUpdatingId] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Broadcast state
  const [broadcast, setBroadcast] = useState({
    title: '',
    category: 'CIVIC_SUPPLY',
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

  const handleQuickGrievanceUpdate = async (id, newStatus, assignedTo, funds, notes) => {
    setUpdatingId(id);
    try {
      await api.updateGrievanceAction(id, {
        status: newStatus,
        assigned_to: assignedTo,
        funds_allocated: funds,
        notes: notes || `Action updated to ${newStatus} by ${currentOfficer?.name || 'Local Officer'}`
      });
      showToast(`Grievance #${id} updated in 1 click!`);
      await refreshData();
    } catch (e) {
      alert("Error updating action");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleServiceDecision = async (id, decision, remarks) => {
    setUpdatingId(id);
    try {
      await api.updateServiceDecision(id, {
        status: decision,
        remarks: remarks || `Status set to ${decision} by ${currentOfficer?.name || 'Officer'}`,
        appointment_date: decision === 'APPROVED' ? 'Digital Seal Stamped & Approved' : 'Scheduled at Panchayat Bhavan'
      });
      showToast(`Service application certified & stamped!`);
      await refreshData();
    } catch (e) {
      alert("Error updating decision");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcast.title || !broadcast.description) return;
    setIsPublishing(true);
    try {
      await api.createNotice(broadcast);
      showToast('Official notice published live to public board!');
      setBroadcast({
        title: '',
        category: 'CIVIC_SUPPLY',
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
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500/50 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Officer Clearance Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
                Clearance: Level 2 Administrative
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentOfficer?.badge || 'VDO-AUTH-901'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Officer Command Radar & Fast Redressal Desk
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Officer: <strong className="text-white">{currentOfficer?.name || 'Local Panchayat Officer'}</strong> ({currentOfficer?.designation || 'VDO'}) · Jurisdiction: {currentOfficer?.panchayat || selectedPlace?.gram_panchayat || 'Division'}.
            </p>
          </div>

          <button
            onClick={refreshData}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Radar</span>
          </button>
        </div>

        {/* 1-View Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Critical Emergency</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {metrics.critical_unresolved}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Immediate sanction required
            </span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Funds Sanctioned</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
              ₹{metrics.total_funds_sanctioned.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Approved contingency repair
            </span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Pending Certificates</span>
              <FileCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-300 font-mono">
              {metrics.pending_applications}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Ready for 1-click digital seal
            </span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Resolution Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {Math.round((metrics.resolved_grievances / (metrics.total_grievances || 1)) * 100)}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {metrics.resolved_grievances} / {metrics.total_grievances} closed
            </span>
          </div>
        </div>
      </div>

      {/* Ward Bottlenecks Radar & Fertilizer Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Ward Bottleneck Radar</span>
              </h3>
              <p className="text-xs text-slate-500">
                Identifies ward hotspots instantly without reading manual field notebooks
              </p>
            </div>

            <div className="flex gap-1">
              {['ALL', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWard(w)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedWard === w
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { ward: 'Ward 3 - Patel Mohalla', type: 'Drinking Water Pipeline Fracture', status: 'In Progress', fund: '₹4,500' },
              { ward: 'Ward 1 - Gandhi Chowk', type: '25 KVA Agricultural Transformer Replacement', status: 'Sanctioned', fund: '₹28,000' },
              { ward: 'Ward 5 - Harijan Basti', type: 'Handpump Lever Replacement & Sanitation', status: 'Pending', fund: '₹0' },
              { ward: 'Ward 2 - Narmada Marg', type: 'Drainage Culvert Slab Repair', status: 'Pending', fund: '₹0' },
              { ward: 'Ward 4 - Station Road', type: 'Solar Lighting Inverter Servicing', status: 'Resolved', fund: '₹3,200' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[11px] font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">{item.ward}</span>
                    <span className="text-slate-500 text-[11px]">{item.type}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Pending' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status} · {item.fund}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PACS Fertilizer Supply Health */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                PACS Cooperative Inventory
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time fertilizer buffer to avoid agricultural shortages
            </p>

            <div className="space-y-3">
              {fertilizers.map((fert, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-1">
                    <span className="truncate max-w-[150px]">{fert.fertilizer_name}</span>
                    <span className="text-emerald-700 font-bold font-mono">{fert.bags_available} Bags</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${fert.bags_available > 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (fert.bags_available / 500) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Govt Price: ₹{fert.price_per_bag}</span>
                    <span>{fert.bags_available > 50 ? 'Adequate' : 'Low Buffer'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Nodal Warehouse: Tehsil Cooperative Pipariya
          </div>
        </div>
      </div>

      {/* Action Queues */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('grievances')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'grievances'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Grievances Fast Redressal</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                {filteredGrievances.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>1-Click Certificate Stamp Desk</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'broadcast'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast Village Notice</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Grievances fast actions */}
        {activeTab === 'grievances' && (
          <div className="p-4 sm:p-6 space-y-4">
            {filteredGrievances.map((g) => (
              <div 
                key={g.id} 
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">
                      {g.ticket_id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {g.ward}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {g.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {g.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-1">
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Officer View: {g.citizen_name_display || g.citizen_name} · {g.mobile_display || g.mobile}
                    </span>
                    {g.landmark && <span>Landmark: {g.landmark}</span>}
                    {g.funds_allocated > 0 && (
                      <span className="font-bold text-slate-800">
                        Sanctioned: ₹{g.funds_allocated}
                      </span>
                    )}
                  </div>
                </div>

                {/* 1-Click Fast Actions */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-2 lg:pt-0">
                  {g.status !== 'RESOLVED' ? (
                    <>
                      <button
                        disabled={updatingId === g.id}
                        onClick={() => handleQuickGrievanceUpdate(
                          g.id, 
                          'IN_PROGRESS', 
                          'Emergency Repair Team', 
                          g.funds_allocated || 2500,
                          'Field repair team assigned by Panchayat Officer.'
                        )}
                        className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 transition shadow-sm"
                      >
                        Assign Team
                      </button>

                      <button
                        disabled={updatingId === g.id}
                        onClick={() => handleQuickGrievanceUpdate(
                          g.id, 
                          'SANCTIONED', 
                          g.assigned_to || 'Panchayat Contractor', 
                          (g.funds_allocated || 0) + 5000,
                          'Emergency repair budget approved.'
                        )}
                        className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1 shadow-sm"
                      >
                        <IndianRupee className="w-3 h-3 text-emerald-400" />
                        <span>Sanction ₹5k</span>
                      </button>

                      <button
                        disabled={updatingId === g.id}
                        onClick={() => handleQuickGrievanceUpdate(
                          g.id, 
                          'RESOLVED', 
                          g.assigned_to, 
                          g.funds_allocated,
                          'Inspection certified. Problem resolved.'
                        )}
                        className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm"
                      >
                        Mark Resolved
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certified Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Certificate 1-Click Stamp */}
        {activeTab === 'services' && (
          <div className="p-4 sm:p-6 space-y-4">
            {services.map((s) => (
              <div 
                key={s.id} 
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                      {s.token_number}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {s.service_type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    Applicant: <strong className="text-slate-900">{s.applicant_name_display || s.applicant_name}</strong> · Contact: {s.mobile_display || s.mobile} · Ward: {s.ward}
                  </p>

                  <p className="text-xs text-slate-500">
                    Reason: {s.reason || 'Scholarship / Welfare verification'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {s.status !== 'APPROVED' && s.status !== 'READY_FOR_PICKUP' ? (
                    <button
                      disabled={updatingId === s.id}
                      onClick={() => handleServiceDecision(s.id, 'APPROVED', 'Panchayat Kotwar verification complete. Digitally stamped.')}
                      className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center gap-1.5 shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>1-Click Approve & Affix Seal</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved & Sealed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Broadcast Notice */}
        {activeTab === 'broadcast' && (
          <div className="p-6 max-w-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Broadcast Official Panchayat Notice
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Instantly publishes to the citizen dashboard and village public display.
            </p>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Drinking Water Tanker Schedule / Special Gram Sabha"
                  value={broadcast.title}
                  onChange={e => setBroadcast({ ...broadcast, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={broadcast.category}
                    onChange={e => setBroadcast({ ...broadcast, category: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
                  >
                    <option value="CIVIC_SUPPLY">Civic Supply (Water / Power)</option>
                    <option value="HEALTH_CAMP">Health Camp</option>
                    <option value="PANCHAYAT_SESSION">Gram Sabha Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date & Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow at 10 AM, Panchayat Bhavan"
                    value={broadcast.event_date}
                    onChange={e => setBroadcast({ ...broadcast, event_date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Circular</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Official instructions for residents..."
                  value={broadcast.description}
                  onChange={e => setBroadcast({ ...broadcast, description: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishing ? 'Broadcasting...' : 'Publish Official Circular'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
