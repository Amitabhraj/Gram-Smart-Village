import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle, Clock, MapPin, Send, Plus, 
  Search, ShieldAlert, Sparkles, Filter, Phone 
} from 'lucide-react';
import { api } from '../api';

export default function GrievanceDesk({ grievances, refreshData, lang }) {
  const isHi = lang === 'hi';
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState(null);

  const [formData, setFormData] = useState({
    citizen_name: '',
    mobile: '',
    ward: 'Ward 3 - Patel Mohalla',
    category: 'Water Supply / नल-जल योजना',
    urgency: 'URGENT',
    landmark: '',
    description: ''
  });

  const categories = [
    'Water Supply / नल-जल योजना',
    'Electricity & Transformer / बिजली',
    'Sanitation & Handpump / हैंडपंप',
    'Roads & Culvert / सड़क एवं पुलिया',
    'Street Light / स्ट्रीट लाइट',
    'Ration & PDS / राशन कार्ड'
  ];

  const wards = [
    'Ward 1 - Gandhi Chowk',
    'Ward 2 - Purana Thana',
    'Ward 3 - Patel Mohalla',
    'Ward 4 - Narmada Road',
    'Ward 5 - Harijan Basti',
    'Ward 6 - Krishi Mandi Marg',
    'Ward 7 - Subhash Nagar'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.citizen_name || !formData.mobile || !formData.description) {
      alert("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await api.createGrievance(formData);
      setLastSubmittedTicket(created.ticket_id);
      setShowForm(false);
      setFormData({
        citizen_name: '',
        mobile: '',
        ward: 'Ward 3 - Patel Mohalla',
        category: 'Water Supply / नल-जल योजना',
        urgency: 'URGENT',
        landmark: '',
        description: ''
      });
      await refreshData();
    } catch (e) {
      alert("Error submitting grievance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = grievances.filter(g => {
    const matchesSearch = 
      g.ticket_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.citizen_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.mobile?.includes(searchQuery) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === 'ALL' || g.category.includes(categoryFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & CTA */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold mb-2">
            <span>💧 ⚡ 🛣️</span>
            <span>{isHi ? 'ग्राम समस्या निवारण' : 'Civic Issue Resolution'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHi ? 'गांव की समस्या बताएं, सीधे समाधान पाएं' : 'Report Village Problem, Track Direct Resolution'}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mt-1">
            {isHi 
              ? 'टूटा हैंडपंप, बिजली ट्रांसफॉर्मर, खराब नाली या पानी की समस्या - बिना किसी दफ्तर के चक्कर काटे सीधे पंचायत सचिव तक।' 
              : 'Direct hotline to Village Development Officer. Track live repair status, budget allocation, and assigned technician.'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>{showForm ? (isHi ? 'फॉर्म बंद करें' : 'Close Form') : (isHi ? '+ नई समस्या दर्ज करें' : '+ Report Issue')}</span>
        </button>
      </div>

      {/* Confirmation of recent submission */}
      {lastSubmittedTicket && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                {isHi ? 'आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है!' : 'Your Grievance is Registered!'}
              </p>
              <p className="text-xs text-emerald-700">
                {isHi ? 'टोकन क्रमांक' : 'Ticket ID'}: <strong className="font-mono text-sm text-stone-900">{lastSubmittedTicket}</strong> — {isHi ? 'अधिकारी नियंत्रण कक्ष को एसएमएस प्रेषित।' : 'SMS alert dispatched to Panchayat Officer.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLastSubmittedTicket(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Submission Form Modal/Section */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-xl transition-all animate-fadeIn">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">
                📝 {isHi ? 'ग्राम समस्या पंजीकरण फॉर्म' : 'Citizen Grievance Registration'}
              </h3>
              <p className="text-xs text-stone-500">
                {isHi ? 'केवल 3 सरल प्रश्नों में अपनी शिकायत दर्ज करें' : 'Fast 1-minute submission direct to Gram Panchayat desk'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-stone-400 hover:text-stone-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'नागरिक का नाम *' : 'Citizen Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.citizen_name}
                  onChange={e => setFormData({ ...formData, citizen_name: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'मोबाइल नंबर (SMS अपडेट हेतु) *' : 'Mobile Number (For SMS) *'}
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  placeholder="e.g. 9827012345"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'वार्ड / मोहल्ला *' : 'Select Ward *'}
                </label>
                <select
                  value={formData.ward}
                  onChange={e => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  {wards.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'समस्या श्रेणी *' : 'Category *'}
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'प्राथमिकता / गंभीरता' : 'Urgency Level'}
                </label>
                <select
                  value={formData.urgency}
                  onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  <option value="NORMAL">Normal / सामान्य (3-5 दिन)</option>
                  <option value="URGENT">Urgent / आवश्यक (24-48 घंटे)</option>
                  <option value="CRITICAL">Emergency / अति-आवश्यक (तत्काल)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHi ? 'पहचान स्थल / लैंडमार्क (उदा. प्राथमिक स्कूल के पास)' : 'Landmark / Location'}
              </label>
              <input
                type="text"
                placeholder={isHi ? 'उदा. मंदिर के सामने, वार्ड 3' : 'e.g. Near Shiv Mandir or Anganwadi'}
                value={formData.landmark}
                onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHi ? 'समस्या का स्पष्ट विवरण *' : 'Problem Description *'}
              </label>
              <textarea
                rows="3"
                required
                placeholder={isHi ? 'उदा. नल जल पाइपलाइन 2 दिन से फूटी है, पानी बह रहा है और घरों में पानी नहीं आ रहा...' : 'Details about the breakdown...'}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : (isHi ? 'शिकायत दर्ज करें' : 'Submit Grievance')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={isHi ? 'टोकन, नाम, मोबाइल या समस्या खोजें...' : 'Search ticket #, citizen name, mobile or problem...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none"
          >
            <option value="ALL">{isHi ? 'सभी श्रेणियां' : 'All Categories'}</option>
            <option value="Water">{isHi ? 'पेयजल (Water)' : 'Water Supply'}</option>
            <option value="Electricity">{isHi ? 'विद्युत (Electricity)' : 'Electricity'}</option>
            <option value="Sanitation">{isHi ? 'सफाई व हैंडपंप' : 'Sanitation & Handpump'}</option>
            <option value="Roads">{isHi ? 'सड़क व पुलिया' : 'Roads & Culverts'}</option>
            <option value="Street Light">{isHi ? 'स्ट्रीट लाइट' : 'Street Lights'}</option>
          </select>
        </div>
      </div>

      {/* Grievance Status Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
            <p className="text-stone-500 text-sm">
              {isHi ? 'कोई शिकायत नहीं मिली।' : 'No grievances matching your search.'}
            </p>
          </div>
        ) : (
          filtered.map(g => (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:border-emerald-300 transition-all"
            >
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded-lg border border-stone-200">
                      {g.ticket_id}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      📍 {g.ward}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      g.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      g.urgency === 'URGENT' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {g.urgency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {g.category}
                  </h3>
                </div>

                {/* Status Badge */}
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                    g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    g.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    g.status === 'SANCTIONED' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {g.status === 'RESOLVED' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    {g.status === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{g.status}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-700 mb-4 bg-stone-50/70 p-3 rounded-2xl border border-stone-100">
                {g.description}
              </p>

              {/* Progress Stepper Visual */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                {[
                  { step: '1', title: isHi ? 'पंजीकृत' : 'Logged', done: true },
                  { step: '2', title: isHi ? 'टीम अधिकृत' : 'Assigned', done: g.status !== 'PENDING' },
                  { step: '3', title: isHi ? 'कार्यरत / बजट' : 'In Work', done: g.status === 'IN_PROGRESS' || g.status === 'SANCTIONED' || g.status === 'RESOLVED' },
                  { step: '4', title: isHi ? 'समाधान' : 'Resolved', done: g.status === 'RESOLVED' },
                ].map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                      s.done ? 'bg-emerald-600 text-white shadow-sm' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <span className={`text-[10px] font-semibold ${s.done ? 'text-emerald-800' : 'text-stone-400'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Meta footer */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>👤 {g.citizen_name}</span>
                  <span>📞 {g.mobile}</span>
                  {g.landmark && <span>📍 {g.landmark}</span>}
                </div>

                <div className="flex items-center gap-3">
                  {g.funds_allocated > 0 && (
                    <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-lg text-xs">
                      ₹{g.funds_allocated} {isHi ? 'स्वीकृत' : 'Sanctioned'}
                    </span>
                  )}
                  {g.assigned_to && (
                    <span className="text-stone-700 font-medium">
                      👷 {g.assigned_to}
                    </span>
                  )}
                </div>
              </div>

              {g.resolution_notes && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs border border-emerald-200 font-medium">
                  ✅ <strong>{isHi ? 'अधिकारी कार्यवाही नोट' : 'Officer Note'}:</strong> {g.resolution_notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
