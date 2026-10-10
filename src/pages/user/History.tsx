import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserSubmissions, fetchUserWithdrawals } from '../../firebase/services';
import { TaskSubmission, WithdrawalRequest } from '../../types';
import { History as HistoryIcon, Clock, CheckCircle2, XCircle, ArrowUpRight, CheckSquare } from 'lucide-react';

export const History: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'withdrawals'>('tasks');
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadHistory();
    }
  }, [userProfile]);

  const loadHistory = async () => {
    if (!userProfile) return;
    try {
      setLoading(true);
      const [subsData, wData] = await Promise.all([
        fetchUserSubmissions(userProfile.uid),
        fetchUserWithdrawals(userProfile.uid)
      ]);
      setSubmissions(subsData);
      setWithdrawals(wData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-medium"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-primary-600" /> Activity History
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'tasks' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'
          }`}
        >
          Task Submissions
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'withdrawals' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'
          }`}
        >
          Withdrawals
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
              <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No task submissions found.</p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-slate-800">{sub.taskTitle}</h3>
                  {getStatusBadge(sub.status)}
                </div>
                {sub.rejectionReason && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">Reason: {sub.rejectionReason}</p>
                )}
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-50">
                  <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {withdrawals.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
              <ArrowUpRight className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No withdrawal requests found.</p>
            </div>
          ) : (
            withdrawals.map((w) => (
              <div key={w.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {w.method} ({w.accountNumber})
                    </span>
                    <p className="text-base font-extrabold text-emerald-600 mt-1">৳{w.amount}</p>
                  </div>
                  {getStatusBadge(w.status)}
                </div>
                {w.rejectionReason && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">Reason: {w.rejectionReason}</p>
                )}
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-50">
                  <span>Requested: {new Date(w.requestedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
