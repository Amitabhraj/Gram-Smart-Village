import React, { useState } from 'react';
import { 
  FileText, CheckCircle, Search, Award, ShieldCheck, 
  Clock, ArrowRight, UserCheck, AlertCircle, Plus 
} from 'lucide-react';
import { api } from '../api';

export default function ServiceDesk({ services, refreshData, lang }) {
  const isHi = lang === 'hi';
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
    ward: 'Ward 3 - Patel Mohalla',
    service_type: 'Caste Certificate Verification (जाति प्रमाण पत्र)',
    reason: ''
  });

  const serviceOptions = [
    'Caste Certificate Verification (जाति प्रमाण पत्र)',
    'Income Certificate Verification (आय प्रमाण पत्र)',
    'Domicile / Residence Proof (निवास प्रमाण पत्र)',
    'PM-Kisan Samman Nidhi e-KYC & Land Seeding',
    'Old-Age / Widow Pension Endorsement (वृद्धा/विधवा पेंशन)',
    'Ration Card Family Member Addition (राशन कार्ड में नाम जोड़ना)',
    'Land Mutation NOC / Panchnama (नामांतरण पंचनामा)'
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
      alert("Please enter full details and last 4 digits of Aadhaar");
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
        ward: 'Ward 3 - Patel Mohalla',
        service_type: 'Caste Certificate Verification (जाति प्रमाण पत्र)',
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
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-400/20 text-sky-200 text-xs px-3 py-1 rounded-full font-bold mb-2">
            <span>📜 🏛️ ✍️</span>
            <span>{isHi ? 'डिजिटल ग्राम सेवा केंद्र' : 'Digital Gram Seva Kendra'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHi ? 'प्रमाण पत्र एवं कल्याणकारी योजना सेवा' : 'Certificates & Welfare Scheme Portal'}
          </h2>
          <p className="text-sky-200 text-sm max-w-xl mt-1">
            {isHi 
              ? 'जाति, आय, निवास, पीएम-किसान सत्यापन या पेंशन हेतु बार-बार ब्लॉक ऑफिस जाने की जरूरत नहीं। ऑनलाइन टोकन पाएं।' 
              : 'No more repeated trips to Tehsil office. Apply in 2 minutes, get digital verification stamp & track status.'}
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>{isHi ? '+ नया प्रमाण पत्र आवेदन' : '+ Apply for Certificate'}</span>
        </button>
      </div>

      {/* 1-Click Fast Token Tracker Search Bar */}
      <div className="bg-white rounded-3xl p-6 border-2 border-sky-500/20 shadow-md">
        <div className="max-w-2xl">
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-sky-600" />
            {isHi ? '1-क्लिक स्थिति ट्रैकर (टोकन या मोबाइल नंबर से)' : '1-Click Application Tracker (By Token # or Mobile)'}
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            {isHi ? 'अपना टोकन नंबर (उदा. GSK-2026-4401) या पंजीकृत मोबाइल नंबर दर्ज करें' : 'Enter your token # (e.g. GSK-2026-4401) or mobile to view digital stamp approval'}
          </p>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder={isHi ? 'उदा. GSK-2026-4401 या 9826198765' : 'e.g. GSK-2026-4401 or 9826198765'}
              value={trackerQuery}
              onChange={e => setTrackerQuery(e.target.value)}
              className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{isSearching ? 'Searching...' : (isHi ? 'खोजें' : 'Check Status')}</span>
            </button>
          </form>
        </div>

        {/* Tracked Results Modal / Display */}
        {trackedResults && (
          <div className="mt-5 pt-4 border-t border-stone-200">
            {trackedResults.length === 0 ? (
              <p className="text-xs text-stone-500 italic">
                {isHi ? 'इस नंबर से कोई आवेदन नहीं मिला।' : 'No records found for this token / mobile.'}
              </p>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-bold text-sky-900 block">
                  {isHi ? `कुल ${trackedResults.length} आवेदन मिले:` : `Found ${trackedResults.length} matching applications:`}
                </span>
                {trackedResults.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-white text-sky-900 px-2 py-0.5 rounded border border-sky-200">
                          {item.token_number}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          {item.service_type}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        👤 {item.applicant_name} · 📞 {item.mobile} · {item.ward}
                      </p>
                      {item.officer_remarks && (
                        <p className="text-xs text-emerald-800 font-medium mt-1">
                          ✍️ {item.officer_remarks}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-black inline-block ${
                        item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        item.status === 'READY_FOR_PICKUP' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {item.status}
                      </span>
                      {item.appointment_date && (
                        <span className="block text-[11px] text-stone-500 mt-1">
                          📅 {item.appointment_date}
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
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-300 text-sky-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-sky-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                {isHi ? 'आवेदन सफलतापूर्वक स्वीकार कर लिया गया है!' : 'Application Successfully Submitted!'}
              </p>
              <p className="text-xs text-sky-700">
                {isHi ? 'आपका टोकन नंबर' : 'Your Token Number'}: <strong className="font-mono text-sm text-stone-900">{createdToken}</strong> — {isHi ? 'पंचायत सचिव द्वारा डिजिटल सत्यापन की प्रक्रिया जारी है।' : 'Panchayat Secretary will verify and approve digitally.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreatedToken(null)}
            className="text-xs text-sky-700 hover:text-sky-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplyModal && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-500/30 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">
                📜 {isHi ? 'प्रमाण पत्र एवं सेवा अनुरोध' : 'Apply for Village Certificate / Welfare'}
              </h3>
              <p className="text-xs text-stone-500">
                {isHi ? 'स्वयं अथवा अपने परिवार के सदस्य हेतु आवेदन करें' : 'Quick digital application for Gram Panchayat Pipariya'}
              </p>
            </div>
            <button
              onClick={() => setShowApplyModal(false)}
              className="text-stone-400 hover:text-stone-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'आवेदक का पूरा नाम *' : 'Applicant Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Patel"
                  value={formData.applicant_name}
                  onChange={e => setFormData({ ...formData, applicant_name: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'पिता / पति का नाम *' : 'Father / Husband Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.guardian_name}
                  onChange={e => setFormData({ ...formData, guardian_name: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  placeholder="e.g. 9826012345"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'आधार के अंतिम 4 अंक *' : 'Aadhaar Last 4 Digits *'}
                </label>
                <input
                  type="text"
                  required
                  maxLength="4"
                  placeholder="e.g. 8841"
                  value={formData.aadhaar_last_four}
                  onChange={e => setFormData({ ...formData, aadhaar_last_four: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isHi ? 'वार्ड / मोहल्ला *' : 'Ward *'}
                </label>
                <select
                  value={formData.ward}
                  onChange={e => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                >
                  <option value="Ward 1 - Gandhi Chowk">Ward 1 - Gandhi Chowk</option>
                  <option value="Ward 2 - Purana Thana">Ward 2 - Purana Thana</option>
                  <option value="Ward 3 - Patel Mohalla">Ward 3 - Patel Mohalla</option>
                  <option value="Ward 4 - Narmada Road">Ward 4 - Narmada Road</option>
                  <option value="Ward 5 - Harijan Basti">Ward 5 - Harijan Basti</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHi ? 'आवश्यक सेवा / प्रमाण पत्र का प्रकार *' : 'Service Type *'}
              </label>
              <select
                value={formData.service_type}
                onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
              >
                {serviceOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHi ? 'आवेदन का कारण / विवरण' : 'Purpose / Details'}
              </label>
              <textarea
                rows="2"
                placeholder={isHi ? 'उदा. कॉलेज छात्रवृत्ति हेतु या बैंक केसीसी लोन हेतु...' : 'e.g., Required for College admission / KCC loan...'}
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
              >
                <span>{isSubmitting ? 'Submitting...' : (isHi ? 'टोकन प्राप्त करें' : 'Generate Token & Submit')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Available Services Grid */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
        <h3 className="font-extrabold text-stone-900 text-base mb-4 flex items-center gap-2">
          <span>🏛️</span>
          <span>{isHi ? 'पंचायत द्वारा दी जाने वाली प्रमुख सेवाएं' : 'Key Panchayat E-Services Available'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'Caste Certificate Verification', hi: 'जाति प्रमाण पत्र सत्यापन', time: '24-48 Hours', tag: 'Scholarship' },
            { title: 'Income Certificate Verification', hi: 'आय प्रमाण पत्र सत्यापन', time: 'Same Day', tag: 'KCC Loan' },
            { title: 'PM-Kisan Samman Nidhi e-KYC', hi: 'पीएम किसान ई-केवाईसी', time: 'Instant Token', tag: '₹6000/yr' },
            { title: 'Widow / Old-Age Pension', hi: 'वृद्धा/विधवा पेंशन संस्तुति', time: 'Gram Sabha Endorsed', tag: 'Social Welfare' },
            { title: 'Ration Card Addition', hi: 'राशन कार्ड में नाम जोड़ना', time: '3-4 Days', tag: 'NFSA' },
            { title: 'Residence / Domicile Proof', hi: 'मूल निवास प्रमाण पत्र', time: '24 Hours', tag: 'Govt Jobs' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-sky-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase">
                  {item.tag}
                </span>
                <h4 className="font-bold text-stone-900 text-sm mt-2">
                  {isHi ? item.hi : item.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  ⏱️ {isHi ? 'निस्तारण समय' : 'Turnaround'}: {item.time}
                </p>
              </div>

              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, service_type: item.title }));
                  setShowApplyModal(true);
                }}
                className="mt-4 text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
              >
                <span>{isHi ? 'आवेदन करें' : 'Apply Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
