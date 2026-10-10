import React, { useEffect, useState } from 'react';
import { 
  createTask, 
  fetchAllSubmissionsForAdmin, 
  fetchAllWithdrawalsForAdmin, 
  updateTaskSubmissionStatus, 
  updateWithdrawalStatus 
} from '../../firebase/services';
import { TaskSubmission, WithdrawalRequest } from '../../types';
import { Toast } from '../../components/common/Toast';
import { ShieldAlert, Plus, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'submissions' | 'withdrawals'>('submissions');
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New Task Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [totalSlots, setTotalSlots] = useState('');
  const [platform, setPlatform] = useState<'bkash' | 'nagad' | 'other'>('bkash');
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [subsData, wData] = await Promise.all([
        fetchAllSubmissionsForAdmin(),
        fetchAllWithdrawalsForAdmin()
      ]);
      setSubmissions(subsData);
      setWithdrawals(wData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingTask(true);
      await createTask({
        title,
        description,
        rewardAmount: parseFloat(rewardAmount),
        totalSlots: parseInt(totalSlots),
        platform
      });
      setToast({ message: 'Task created successfully!', type: 'success' });
      setTitle('');
      setDescription('');
      setRewardAmount('');
      setTotalSlots('');
    } catch (err) {
      setToast({ message: 'Failed to create task.', type: 'error' });
    } finally {
      setCreatingTask(false);
    }
  };

  const handleSubAction = async (subId: string, userId: string, reward: number, status: 'approved' | 'rejected') => {
    try {
      await updateTaskSubmissionStatus(subId, userId, reward, status);
      setSubmissions(submissions.map(s => s.id === subId ? { ...s, status } : s));
      setToast({ message: `Submission ${status} successfully.`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update submission.', type: 'error' });
    }
  };

  const handleWithdrawalAction = async (wId: string, userId: string, amount: number, status: 'approved' | 'rejected') => {
    try {
      await updateWithdrawalStatus(wId, userId, amount, status);
      setWithdrawals(withdrawals.map(w => w.id === wId ? { ...w, status } : w));
      setToast({ message: `Withdrawal ${status} successfully.`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update withdrawal.', type: 'error' });
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center space-x-2 bg-slate-900 text-white p-4 rounded-2xl shadow-md">
        <ShieldAlert className="w-6 h-6 text-sky-400" />
        <div>
          <h2 className="text-base font-bold">Admin Control Panel</h2>
          <p className="text-xs text-slate-400">Manage tasks, submissions and user payouts</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`py-2 rounded-lg transition-all ${activeTab === 'submissions' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'}`}
        >
          Submissions
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`py-2 rounded-lg transition-all ${activeTab === 'withdrawals' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'}`}
        >
          Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-2 rounded-lg transition-all ${activeTab === 'tasks' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'}`}
        >
          New Task
        </button>
      </div>

      {activeTab === 'submissions' && (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{sub.userEmail}</span>
                  <h3 className="text-sm font-bold text-slate-800">{sub.taskTitle}</h3>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                  sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  sub.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {sub.status}
                </span>
              </div>

              {sub.screenshots && sub.screenshots.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-50">
                  <img src={sub.screenshots[0]} alt="Proof" className="w-full h-full object-cover" />
                </div>
              )}

              {sub.userNote && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">Note: {sub.userNote}</p>
              )}

              {sub.status === 'pending' && (
                <div className="flex space-x-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleSubAction(sub.id, sub.userId, 10, 'approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleSubAction(sub.id, sub.userId, 10, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="space-y-3">
          {withdrawals.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                    {w.method.toUpperCase()} ({w.accountNumber})
                  </span>
                  <p className="text-base font-extrabold text-emerald-600 mt-1">৳{w.amount}</p>
                  <p className="text-[10px] text-slate-400">{w.userEmail}</p>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                  w.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  w.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {w.status}
                </span>
              </div>

              {w.status === 'pending' && (
                <div className="flex space-x-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleWithdrawalAction(w.id, w.userId, w.amount, 'approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Pay
                  </button>
                  <button
                    onClick={() => handleWithdrawalAction(w.id, w.userId, w.amount, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <form onSubmit={handleCreateTask} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Create New Task</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Subscribe channel & watch"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description & Instructions</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide step-by-step instructions..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reward (BDT)</label>
              <input
                type="number"
                required
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Total Slots</label>
              <input
                type="number"
                required
                value={totalSlots}
                onChange={(e) => setTotalSlots(e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e: any) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white"
            >
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creatingTask}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {creatingTask ? 'Creating...' : 'Publish Task'}
          </button>
        </form>
      )}
    </div>
  );
};
