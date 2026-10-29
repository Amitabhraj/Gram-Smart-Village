import React from 'react';
import { HeartPulse, Calendar, Clock, MapPin, Phone, Megaphone, CheckCircle2 } from 'lucide-react';

export default function NoticeHealth({ notices, healthSchedules }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider mb-2 inline-block">
            Primary Health & Public Notice System
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            PHC Doctor Timetable & Gram Panchayat Circulars
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
            Direct schedule of visiting Medical Officers, ANM infant immunization clinics, medicine stock buffers, and official Gram Sabha notices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Schedules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Primary Health Centre (PHC) OPD Schedule</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">
                Ward 1 Sub-Centre
              </span>
            </div>

            <div className="space-y-4">
              {healthSchedules.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {doc.practitioner_name}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold">
                        {doc.designation} · {doc.service_type}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <p className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.visiting_time}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Helpline: {doc.contact_number}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Essential Medicines:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {doc.medicine_stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Public Village Notices */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                <span>Panchayat Public Circulars & Alerts</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">
                Official Notices
              </span>
            </div>

            <div className="space-y-4">
              {notices.map((n, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    n.priority === 'URGENT' 
                      ? 'bg-rose-50/60 border-rose-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                      n.priority === 'URGENT' ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {n.category} · {n.priority}
                    </span>
                    {n.event_date && (
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{n.event_date}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {n.title}
                  </h4>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {n.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    {n.venue && <span>Venue: {n.venue}</span>}
                    <span className="font-semibold text-slate-700">Issued by: {n.issued_by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
