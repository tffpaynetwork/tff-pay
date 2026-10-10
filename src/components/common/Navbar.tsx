import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Wallet } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { userProfile, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-sky-600 bg-clip-text text-transparent">
          TFF PAY
        </h1>
      </div>

      {userProfile && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
            <Wallet className="w-4 h-4 text-primary-600 mr-1.5" />
            <span className="text-sm font-semibold text-primary-700">
              ৳{(userProfile.mainBalance || 0) + (userProfile.commissionBalance || 0)}
            </span>
          </div>
          <button 
            onClick={() => logout()}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};
