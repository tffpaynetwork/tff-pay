import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { requestWithdrawal } from '../../firebase/services';
import { Toast } from '../../components/common/Toast';
import { Wallet as WalletIcon, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const Wallet: React.FC = () => {
  const { userProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const mainBalance = userProfile?.mainBalance || 0;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setToast({ message: 'Please enter a valid amount.', type: 'error' });
      return;
    }

    if (withdrawAmount > mainBalance) {
      setToast({ message: 'Insufficient main balance.', type: 'error' });
      return;
    }

    if (withdrawAmount < 100) {
      setToast({ message: 'Minimum withdrawal amount is ৳100.', type: 'error' });
      return;
    }

    if (!userProfile) return;

    try {
      setLoading(true);
      await requestWithdrawal({
        userId: userProfile.uid,
        userEmail: userProfile.email,
        amount: withdrawAmount,
        method,
        accountNumber
      });

      setToast({ message: 'Withdrawal request submitted successfully!', type: 'success' });
      setAmount('');
      setAccountNumber('');
    } catch (err: any) {
      setToast({ message: 'Failed to submit withdrawal request.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">My Wallet</span>
          <WalletIcon className="w-5 h-5 text-sky-400" />
        </div>

        <div>
          <p className="text-xs text-slate-400">Withdrawable Main Balance</p>
          <p className="text-3xl font-extrabold mt-1 text-emerald-400">৳{mainBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Request Withdrawal</h3>

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('bkash')}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  method === 'bkash' 
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' 
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                bKash
              </button>
              <button
                type="button"
                onClick={() => setMethod('nagad')}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  method === 'nagad' 
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Nagad
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {method.toUpperCase()} Account Number
            </label>
            <input
              type="tel"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="01700000000"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (BDT)</label>
            <input
              type="number"
              required
              min="100"
              max={mainBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum ৳100"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || mainBalance < 100}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            {loading ? 'Processing...' : 'Withdraw Request'}
          </button>
        </form>
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs text-sky-800 space-y-1">
        <p className="font-bold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> Withdrawal Policy
        </p>
        <p className="text-sky-700">Withdrawals are processed securely within 24 hours. Minimum limit is ৳100.</p>
      </div>
    </div>
  );
};
