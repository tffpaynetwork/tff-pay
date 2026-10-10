import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Award, Users, CheckSquare, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { userProfile } = useAuth();

  const totalBalance = (userProfile?.mainBalance || 0) + (userProfile?.commissionBalance || 0);

  return (
    <div className="pb-20 pt-4 px-4 max-w-lg mx-auto space-y-5">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-primary-600 to-sky-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-100 font-medium">Welcome back,</p>
            <h2 className="text-xl font-bold mt-0.5">{userProfile?.displayName || 'User'}</h2>
          </div>
          <span className="bg-white/20 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-end">
          <div>
            <p className="text-xs text-primary-100">Total Account Balance</p>
            <p className="text-3xl font-extrabold mt-1">৳{totalBalance.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => setActiveTab('wallet')}
            className="bg-white text-primary-700 font-semibold px-4 py-2 rounded-xl text-xs shadow-sm hover:bg-primary-50 transition-all flex items-center gap-1"
          >
            Withdraw <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balance Details Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Main Balance</p>
            <p className="text-base font-bold text-slate-800">৳{userProfile?.mainBalance || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Commission</p>
            <p className="text-base font-bold text-slate-800">৳{userProfile?.commissionBalance || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveTab('tasks')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-primary-50 hover:border-primary-100 transition-all group"
          >
            <CheckSquare className="w-6 h-6 text-primary-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-700">Available Tasks</span>
          </button>

          <button 
            onClick={() => setActiveTab('referral')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-sky-50 hover:border-sky-100 transition-all group"
          >
            <Users className="w-6 h-6 text-sky-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-700">Invite & Earn</span>
          </button>
        </div>
      </div>

      {/* Referral Info */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <p className="text-xs text-slate-400">Your Referral Code</p>
          <p className="text-lg font-mono font-bold text-sky-400 tracking-wider">{userProfile?.referralCode || 'N/A'}</p>
        </div>
        <button 
          onClick={() => setActiveTab('referral')}
          className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs px-3 py-1.5 rounded-lg hover:bg-sky-500/30 transition-all"
        >
          View Team
        </button>
      </div>
    </div>
  );
};
