import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2, MapPin, AlertCircle, Lock } from 'lucide-react';
import { api } from '../api';

export default function ReportGrievanceModal({ isOpen, onClose, selectedPlace, onGrievanceCreated }) {
  const [formData, setFormData] = useState({
    citizen_name: '',
    mobile: '',
    village_name: selectedPlace?.name || 'Pipariya',
    ward: 'Ward 1',
    category: 'Drinking Water Pipeline',
    urgency: 'URGENT',
    landmark: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdTicket, setCreatedTicket] = useState(null);

  if (!isOpen) return null;

  const categories = [
    'Drinking Water Pipeline',
    'Handpump & Groundwater',
    'Power Grid & Transformer',
    'Drainage & Road Culvert',
    'Public Street Lighting',
    'Sanitation & Waste Disposal',
    'Primary School / Anganwadi Repair'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.citizen_name || !formData.mobile || !formData.description) {
      setError('Please provide your name, mobile number, and detailed description.');
      return;
    }

    if (formData.mobile.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createGrievance(formData);
      setCreatedTicket(res.ticket_id);
      onGrievanceCreated();
    } catch (err) {
      setError('Server error submitting grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Public Civic Grievance Registration</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Gram Panchayat Jurisdiction: {selectedPlace?.gram_panchayat || selectedPlace?.name || 'General Division'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {createdTicket ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                Grievance Formally Registered
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your ticket has been logged into the Gram Panchayat dispatch queue. Keep this tracking code:
              </p>
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-base font-black text-slate-900 border border-slate-300 inline-block">
                {createdTicket}
              </div>
              <p className="text-[11px] text-slate-400">
                In compliance with privacy standards, your name and mobile number are masked from public view and accessible only to verified Panchayat Officers.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                >
                  Done & Return to Dossier
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy Notice Pill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Citizen Privacy Assurance:</strong> No login or sign-up is required. Your personal contact details will remain strictly confidential and will only be shared with authorized local officers for resolution verification.
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Citizen Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Patel"
                    value={formData.citizen_name}
                    onChange={e => setFormData({ ...formData, citizen_name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village / GP
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.village_name}
                    onChange={e => setFormData({ ...formData, village_name: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ward / Sector
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward 3"
                    value={formData.ward}
                    onChange={e => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-800"
                  >
                    <option value="NORMAL">Normal (Routine)</option>
                    <option value="URGENT">Urgent (24-48h)</option>
                    <option value="CRITICAL">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category of Breakdown *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-800"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark / Proximity
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Shiv Mandir, Primary School Ground"
                  value={formData.landmark}
                  onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Nature of Breakdown *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the issue clearly (e.g. Main water valve fractured, 40 households affected since morning)..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering...' : 'Submit Grievance'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
