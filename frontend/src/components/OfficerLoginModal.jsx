import React, { useState } from 'react';
import { Shield, Lock, User, Key, CheckCircle2, AlertCircle, X, Building2 } from 'lucide-react';
import { api } from '../api';

export default function OfficerLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [officerId, setOfficerId] = useState('vdo.pipariya');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.officerLogin(officerId, password);
      if (res.success) {
        localStorage.setItem('officer_token', res.token);
        localStorage.setItem('officer_data', JSON.stringify(res.officer));
        onLoginSuccess(res.officer);
        onClose();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (id, pass) => {
    setOfficerId(id);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <Shield className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight text-white">
                Local Officer Portal Login
              </h3>
              <p className="text-[11px] text-slate-400">
                Panchayati Raj Department · Authorized Personnel
              </p>
            </div>
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
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
            <p className="font-medium text-slate-800 mb-1">Government Officer Clearance Note:</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              No sign-up is required. Credentials are pre-assigned by the Block Development Office. Villagers do not require sign-in to register or track grievances.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Officer ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. vdo.pipariya or sachiv.rampur"
                  value={officerId}
                  onChange={e => setOfficerId(e.target.value)}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Security Password / Official PIN
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Official Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Quick Demo Credentials */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Fast Login Selector (Pre-authorized)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('vdo.pipariya', 'admin123')}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition text-xs"
                >
                  <span className="font-semibold text-slate-800 block text-[11px]">VDO Rajesh Verma</span>
                  <span className="text-[10px] text-slate-500">Pipariya GP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('sachiv.rampur', 'admin123')}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition text-xs"
                >
                  <span className="font-semibold text-slate-800 block text-[11px]">Sachiv Anita Sharma</span>
                  <span className="text-[10px] text-slate-500">Rampur GP</span>
                </button>
              </div>
            </div>

            <div className="pt-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isLoading ? 'Verifying...' : 'Authorize Login'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
