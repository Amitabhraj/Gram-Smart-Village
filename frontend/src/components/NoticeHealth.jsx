import React from 'react';
import { 
  HeartPulse, Calendar, Clock, MapPin, Phone, 
  AlertTriangle, Megaphone, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export default function NoticeHealth({ notices, healthSchedules, lang }) {
  const isHi = lang === 'hi';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-teal-400/20 text-teal-200 text-xs px-3 py-1 rounded-full font-bold mb-2">
            <span>🏥 📢 💊</span>
            <span>{isHi ? 'ग्राम स्वास्थ्य एवं सार्वजनिक सूचना' : 'Village Health & Public Notices'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHi ? 'स्वास्थ्य केंद्र डॉक्टर सारणी एवं ग्राम घोषणाएं' : 'PHC Doctor Timetable & Gram Sabha Bulletins'}
          </h2>
          <p className="text-teal-200 text-sm max-w-xl mt-1">
            {isHi 
              ? 'उप-स्वास्थ्य केंद्र में डॉक्टर किस दिन आएंगे, बच्चों का टीकाकरण कब होगा और गांव की जरूरी बैठकें कब हैं - सब एक जगह।' 
              : 'Never miss doctor visiting days, infant immunizations, or urgent water tanker and Gram Sabha schedules.'}
          </p>
        </div>
      </div>

      {/* Grid: Health Schedules and Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Schedules */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <span>{isHi ? 'उप-स्वास्थ्य केंद्र डॉक्टर व एएनएम सारणी' : 'PHC Medical Team & OPD Schedule'}</span>
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {isHi ? 'वार्ड 1 स्वास्थ्य केंद्र' : 'Ward 1 Sub-Centre'}
              </span>
            </div>

            <div className="space-y-4">
              {healthSchedules.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-teal-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {doc.practitioner_name}
                      </h4>
                      <p className="text-xs text-teal-700 font-semibold">
                        {doc.designation} · {doc.service_type}
                      </p>
                    </div>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                      OPD
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1 pt-1">
                    <p className="flex items-center gap-1.5 font-medium text-stone-800">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{doc.visiting_time}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{doc.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{isHi ? 'हेल्पलाइन' : 'Helpline'}: {doc.contact_number}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">{isHi ? 'दवा उपलब्धता' : 'Medicine Stock'}:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {doc.medicine_stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Public Village Notices */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <span>{isHi ? 'ग्राम पंचायत सार्वजनिक सूचना पट्ट' : 'Gram Panchayat Public Notice Board'}</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {isHi ? 'सक्रिय सूचनाएं' : 'Active'}
              </span>
            </div>

            <div className="space-y-4">
              {notices.map((n, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    n.priority === 'URGENT' 
                      ? 'bg-rose-50/70 border-rose-200' 
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      n.priority === 'URGENT' ? 'bg-rose-200 text-rose-800 animate-pulse' : 'bg-stone-200 text-stone-800'
                    }`}>
                      {n.category} · {n.priority}
                    </span>
                    {n.event_date && (
                      <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{n.event_date}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-stone-900 text-sm">
                    {n.title}
                  </h4>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {n.description}
                  </p>

                  <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500">
                    {n.venue && <span>📍 {n.venue}</span>}
                    <span className="font-semibold text-stone-700">✍️ {n.issued_by}</span>
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
