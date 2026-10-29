import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, MapPin, Lock, User, IndianRupee, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function TrackComplaintModal({ isOpen, onClose, currentOfficer }) {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!ticketId.trim()) return;

    setError('');
    setIsLoading(true);
    setResult(null);
    try {
      const data = await api.trackGrievance(ticketId.trim());
      if (data && data.ticket_id) {
        setResult(data);
      } else {
        setError(data?.error || 'No record found with this ticket number. Please verify the code.');
      }
    } catch (err) {
      setError('Unable to fetch tracking data. Please verify the ticket code.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOfficer = Boolean(currentOfficer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-tight text-white">
              Public Complaint Tracker
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-slate-500 mb-4">
            Enter your formal grievance reference number (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">GRM-2026-101</code>) to track current status, assigned crew, and resolution history.
          </p>

          <form onSubmit={handleTrack} className="flex gap-2 mb-4">
            <input
              type="text"
              required
              placeholder="e.g. GRM-2026-101"
              value={ticketId}
              onChange={e => setTicketId(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shrink-0"
            >
              {isLoading ? 'Searching...' : 'Track Record'}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {result.ticket_id}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    {result.category}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Jurisdiction: {result.ward} ({result.village_name || 'Village'})
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  result.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  result.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  result.status === 'SANCTIONED' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                  'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {result.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                {result.description}
              </p>

              {/* Progress Stepper */}
              <div className="grid grid-cols-4 gap-1.5 py-2 text-center">
                {[
                  { step: '1', title: 'Logged', done: true },
                  { step: '2', title: 'Assigned', done: result.status !== 'PENDING' },
                  { step: '3', title: 'Funded / Active', done: result.status === 'IN_PROGRESS' || result.status === 'SANCTIONED' || result.status === 'RESOLVED' },
                  { step: '4', title: 'Resolved', done: result.status === 'RESOLVED' },
                ].map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5 ${
                      s.done ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <span className={`text-[9px] font-medium ${s.done ? 'text-slate-800' : 'text-slate-400'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Citizen Details Privacy Shield */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  {isOfficer ? (
                    <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <User className="w-3.5 h-3.5" />
                      <span>{result.citizen_name_display || result.citizen_name} ({result.mobile_display || result.mobile})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{result.citizen_name_display} · {result.mobile_display}</span>
                      <span className="text-[10px] text-slate-400">(Protected)</span>
                    </div>
                  )}
                </div>

                {result.assigned_to && (
                  <span className="text-slate-700 font-medium text-[11px]">
                    Crew: {result.assigned_to}
                  </span>
                )}
              </div>

              {result.resolution_notes && (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 text-xs rounded-lg border border-emerald-200">
                  <strong>Panchayat Note:</strong> {result.resolution_notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
