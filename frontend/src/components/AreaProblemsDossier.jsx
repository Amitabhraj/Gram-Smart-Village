import React, { useState } from 'react';
import { 
  Building2, MapPin, AlertTriangle, CheckCircle2, Clock, 
  Search, Plus, Shield, Lock, Phone, User, Filter, ArrowRight,
  ExternalLink, Layers, IndianRupee, FileText, Check
} from 'lucide-react';
import { api } from '../api';

export default function AreaProblemsDossier({ 
  selectedPlace, 
  grievances, 
  currentOfficer, 
  onRefresh,
  onOpenReportModal,
  onOpenTrackModal
}) {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filter grievances for the current area / place
  const areaGrievances = grievances.filter(g => {
    if (!selectedPlace) return true;
    const placeName = selectedPlace.name?.toLowerCase();
    const gpName = selectedPlace.gram_panchayat?.toLowerCase();
    const gVillage = g.village_name?.toLowerCase();
    const gWard = g.ward?.toLowerCase();

    const matchesPlace = 
      !placeName ||
      gVillage?.includes(placeName) ||
      gWard?.includes(placeName) ||
      gpName?.includes(gVillage);

    return matchesPlace;
  });

  // Apply filters
  const filtered = areaGrievances.filter(g => {
    const matchesCategory = categoryFilter === 'ALL' || g.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesUrgency = urgencyFilter === 'ALL' || g.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesSearch = 
      !searchQuery ||
      g.ticket_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ward?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesUrgency && matchesStatus && matchesSearch;
  });

  const criticalCount = areaGrievances.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED').length;
  const inProgressCount = areaGrievances.filter(g => g.status === 'IN_PROGRESS' || g.status === 'SANCTIONED').length;
  const resolvedCount = areaGrievances.filter(g => g.status === 'RESOLVED').length;

  const handleOfficerQuickAction = async (id, newStatus, assignedTo, funds, notes) => {
    setUpdatingId(id);
    try {
      await api.updateGrievanceAction(id, {
        status: newStatus,
        assigned_to: assignedTo,
        funds_allocated: funds,
        notes: notes || `Status updated to ${newStatus} by ${currentOfficer?.name || 'Local Officer'}`
      });
      await onRefresh();
    } catch (e) {
      alert("Error performing action");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Area Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                Jurisdiction Dossier
              </span>
              <span className="text-xs text-slate-500">
                Panchayat Code: {selectedPlace?.pincode ? `PIN-${selectedPlace.pincode}` : 'NATIONAL-GRID'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedPlace?.gram_panchayat || selectedPlace?.name || 'All Registered Gram Panchayats'}
            </h2>

            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {selectedPlace?.full_name || 'Multi-Village Administrative Jurisdiction · Central Redressal System'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenReportModal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue in this Area</span>
            </button>

            <button
              onClick={onOpenTrackModal}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Track Ticket ID</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar for this Area */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">
              Total Logged
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {areaGrievances.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">In this jurisdiction</span>
          </div>

          <div className="bg-rose-50/70 rounded-xl p-3.5 border border-rose-200">
            <span className="text-[11px] font-medium text-rose-700 block">
              Critical Alerts
            </span>
            <span className="text-2xl font-black text-rose-700 font-mono">
              {criticalCount}
            </span>
            <span className="text-[10px] text-rose-500 block mt-0.5">High priority action</span>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200">
            <span className="text-[11px] font-medium text-amber-800 block">
              Active In Progress
            </span>
            <span className="text-2xl font-black text-amber-800 font-mono">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-amber-600 block mt-0.5">Work assigned/funded</span>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200">
            <span className="text-[11px] font-medium text-emerald-800 block">
              Verified Resolved
            </span>
            <span className="text-2xl font-black text-emerald-800 font-mono">
              {resolvedCount}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Inspection certified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Ticket ID, description, or ward..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Water">Drinking Water</option>
            <option value="Power">Power Grid & Transformer</option>
            <option value="Handpump">Handpump & Groundwater</option>
            <option value="Drainage">Drainage & Roads</option>
            <option value="Lighting">Street Lighting</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={e => setUrgencyFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">Emergency</option>
            <option value="URGENT">Urgent</option>
            <option value="NORMAL">Normal</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SANCTIONED">Sanctioned</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Grievance Problem List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">
              No Reported Breakdowns in this Filter
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Either this area has zero active infrastructure complaints or your filter criteria matched no entries.
            </p>
            <button
              onClick={() => { setCategoryFilter('ALL'); setUrgencyFilter('ALL'); setStatusFilter('ALL'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const isOfficerLoggedIn = Boolean(currentOfficer);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
              >
                {/* Top Row: Ticket ID, Ward, Status */}
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-extrabold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                        {item.ticket_id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.ward} ({item.village_name || selectedPlace?.name || 'Village'})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        item.urgency === 'URGENT' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {item.category}
                    </h3>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      item.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      item.status === 'SANCTIONED' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.status === 'RESOLVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.status === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>

                {/* Problem Description */}
                <p className="text-sm text-slate-700 font-normal leading-relaxed mb-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {item.description}
                </p>

                {/* Progress Stepper Bar */}
                <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                  {[
                    { step: '1', title: 'Logged', done: true },
                    { step: '2', title: 'Assigned', done: item.status !== 'PENDING' },
                    { step: '3', title: 'Fund / Action', done: item.status === 'IN_PROGRESS' || item.status === 'SANCTIONED' || item.status === 'RESOLVED' },
                    { step: '4', title: 'Resolved', done: item.status === 'RESOLVED' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                        s.done ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {s.done ? '✓' : s.step}
                      </div>
                      <span className={`text-[10px] font-semibold ${s.done ? 'text-slate-800' : 'text-slate-400'}`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Metadata & Complainer Privacy Guard */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {/* Complainer Details: Masked for Public, Unmasked for Local Officers */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {isOfficerLoggedIn ? (
                      /* Officer View: Full details */
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-semibold">{item.citizen_name_display || item.citizen_name}</span>
                        <span className="text-emerald-700 font-mono">({item.mobile_display || item.mobile})</span>
                        <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded">
                          Officer Clearance
                        </span>
                      </div>
                    ) : (
                      /* Public / Villager View: Masked */
                      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-800">{item.citizen_name_display}</span>
                        <span className="text-slate-500 font-mono">{item.mobile_display}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          (Citizen Identity Shielded)
                        </span>
                      </div>
                    )}

                    {item.landmark && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.landmark}</span>
                      </span>
                    )}
                  </div>

                  {/* Action / Assigned / Budget Tag */}
                  <div className="flex items-center gap-3">
                    {item.funds_allocated > 0 && (
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        ₹{item.funds_allocated.toLocaleString('en-IN')} Sanctioned
                      </span>
                    )}
                    {item.assigned_to && (
                      <span className="text-slate-600 font-medium">
                        Unit: {item.assigned_to}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resolution Notes */}
                {item.resolution_notes && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 text-emerald-900 text-xs border border-emerald-200">
                    <strong>Official Action Note:</strong> {item.resolution_notes}
                  </div>
                )}

                {/* 1-Click Fast Officer Actions if Officer is Logged in */}
                {isOfficerLoggedIn && item.status !== 'RESOLVED' && (
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-500 mr-1">
                      1-Click Officer Action:
                    </span>

                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleOfficerQuickAction(
                        item.id,
                        'IN_PROGRESS',
                        'Dispatched Field Crew',
                        item.funds_allocated || 2500,
                        'Field crew dispatched by Panchayat Officer.'
                      )}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 transition flex items-center gap-1"
                    >
                      <span>Assign Field Crew</span>
                    </button>

                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleOfficerQuickAction(
                        item.id,
                        'SANCTIONED',
                        item.assigned_to || 'Contractor Sanction',
                        (item.funds_allocated || 0) + 5000,
                        'Emergency contingency repair fund approved.'
                      )}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1"
                    >
                      <IndianRupee className="w-3 h-3 text-emerald-400" />
                      <span>Sanction ₹5,000</span>
                    </button>

                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleOfficerQuickAction(
                        item.id,
                        'RESOLVED',
                        item.assigned_to,
                        item.funds_allocated,
                        'Field inspection verified. Breakdown restored successfully.'
                      )}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
