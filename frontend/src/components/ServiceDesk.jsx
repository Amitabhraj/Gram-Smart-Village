import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Search, ShieldCheck, 
  Clock, ArrowRight, UserCheck, AlertCircle, Plus, Lock 
} from 'lucide-react';
import { api } from '../api';

export default function ServiceDesk({ services, refreshData, selectedPlace }) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [trackerQuery, setTrackerQuery] = useState('');
  const [trackedResults, setTrackedResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdToken, setCreatedToken] = useState(null);

  const [formData, setFormData] = useState({
    applicant_name: '',
    guardian_name: '',
    mobile: '',
    aadhaar_last_four: '',
    village_name: selectedPlace?.name || 'Pipariya',
    ward: 'Ward 1',
    service_type: 'Caste Certificate Verification',
    reason: ''
  });

  const serviceOptions = [
    'Caste Certificate Verification',
    'Income Certificate Verification',
    'Domicile / Residence Proof Certificate',
    'PM-Kisan Samman Nidhi e-KYC & Land Seeding',
    'Social Security Widow / Old-Age Pension',
    'Ration Card Family Member Addition',
    'Land Mutation NOC / Panchnama'
  ];

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackerQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await api.trackServiceToken(trackerQuery.trim());
      setTrackedResults(results);
    } catch (e) {
      alert("Error tracking token");
    } finally {
      setIsSearching(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.applicant_name || !formData.mobile || formData.aadhaar_last_four.length !== 4) {
      alert("Please enter full details and the last 4 digits of Aadhaar.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.createService(formData);
      setCreatedToken(res.token_number);
      setShowApplyModal(false);
      setFormData({
        applicant_name: '',
        guardian_name: '',
        mobile: '',
        aadhaar_last_four: '',
        village_name: selectedPlace?.name || 'Pipariya',
        ward: 'Ward 1',
        service_type: 'Caste Certificate Verification',
        reason: ''
      });
      await refreshData();
    } catch (e) {
      alert("Error submitting application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider mb-2 inline-block">
            Digital Gram Seva Kendra
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Panchayat Certificates & Social Welfare Portal
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
            Apply online for Caste, Income, PM-Kisan verification, or Pension endorsements. Track approval records and digital stamps without visiting Tehsil offices.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Certificate Application</span>
        </button>
      </div>

      {/* 1-Click Fast Token Tracker Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="max-w-xl">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-slate-700" />
            <span>Track Application Status (By Token # or Mobile)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Enter your application token number (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">GSK-2026-4401</code>) or registered mobile number.
          </p>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. GSK-2026-4401 or 9826198765"
              value={trackerQuery}
              onChange={e => setTrackerQuery(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 font-mono"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <span>{isSearching ? 'Searching...' : 'Check Status'}</span>
            </button>
          </form>
        </div>

        {/* Tracked Results Display */}
        {trackedResults && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            {trackedResults.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No matching records found for this query.
              </p>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-700 block">
                  Found {trackedResults.length} matching certificate application(s):
                </span>
                {trackedResults.map(item => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-white text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                          {item.token_number}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {item.service_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Applicant: {item.applicant_name_display || item.applicant_name} · Ward: {item.ward}
                      </p>
                      {item.officer_remarks && (
                        <p className="text-xs text-emerald-800 font-medium mt-1">
                          Officer Note: {item.officer_remarks}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                        item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        item.status === 'READY_FOR_PICKUP' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                      {item.appointment_date && (
                        <span className="block text-[11px] text-slate-500 mt-1">
                          {item.appointment_date}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation of newly submitted application */}
      {createdToken && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Application Successfully Logged
              </p>
              <p className="text-xs text-emerald-800">
                Tracking Reference: <strong className="font-mono text-sm text-slate-900">{createdToken}</strong>. Panchayat Secretary verification queued.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreatedToken(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                Certificate & Welfare Verification Application
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikas Patel"
                    value={formData.applicant_name}
                    onChange={e => setFormData({ ...formData, applicant_name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.guardian_name}
                    onChange={e => setFormData({ ...formData, guardian_name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar (Last 4 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength="4"
                    placeholder="e.g. 8841"
                    value={formData.aadhaar_last_four}
                    onChange={e => setFormData({ ...formData, aadhaar_last_four: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Type *</label>
                <select
                  value={formData.service_type}
                  onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-800"
                >
                  {serviceOptions.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Remarks</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Scholarship requirement or KCC loan verification..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit & Generate Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Available Services Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Panchayat E-Governance Service Offerings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'Caste Certificate Verification', time: '24-48 Hours', tag: 'Scholarship' },
            { title: 'Income Certificate Verification', time: 'Same Day', tag: 'KCC Loan' },
            { title: 'PM-Kisan Samman Nidhi e-KYC', time: 'Instant Token', tag: '₹6000/yr' },
            { title: 'Widow / Old-Age Pension', time: 'Gram Sabha Endorsement', tag: 'Social Security' },
            { title: 'Ration Card Member Addition', time: '3-4 Days', tag: 'NFSA Portal' },
            { title: 'Residence / Domicile Proof', time: '24 Hours', tag: 'Employment' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 uppercase font-mono">
                  {item.tag}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Standard Processing: {item.time}
                </p>
              </div>

              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, service_type: item.title }));
                  setShowApplyModal(true);
                }}
                className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>Initiate Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
