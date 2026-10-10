import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../components/common/Toast';
import { Users, Copy, Share2, Award } from 'lucide-react';

export const Referral: React.FC = () => {
  const { userProfile } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const referralCode = userProfile?.referralCode || 'N/A';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Copied to clipboard!', type: 'success' });
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-gradient-to-br from-sky-600 to-primary-700 rounded-2xl p-5 text-white shadow-lg space-y-3">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-sky-200" />
          <h2 className="text-lg font-bold">Refer & Earn</h2>
        </div>
        <p className="text-xs text-sky-100 leading-relaxed">
          Invite your friends to TFF PAY and earn commission on every task they complete successfully!
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Your Referral Code
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralCode}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 outline-none"
            />
            <button
              onClick={() => copyToClipboard(referralCode)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Your Referral Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 outline-none truncate"
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Referral Earnings
        </h3>
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-600">Total Commission Balance</span>
          <span className="text-lg font-extrabold text-emerald-600">৳{userProfile?.commissionBalance || 0}</span>
        </div>
      </div>
    </div>
  );
};
