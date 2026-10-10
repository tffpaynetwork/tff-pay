import React from 'react';
import { Home, CheckSquare, History, Wallet, Users } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const userNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'history', label: 'History', icon: History },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referral', label: 'Referral', icon: Users },
  ];

  const adminNavItems = [
    { id: 'admin_dash', label: 'Dashboard', icon: Home },
    { id: 'admin_tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'admin_subs', label: 'Submissions', icon: History },
    { id: 'admin_withdrawals', label: 'Withdrawals', icon: Wallet },
    { id: 'admin_users', label: 'Users', icon: Users },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-30 px-2 py-1 flex justify-around items-center shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              isActive 
                ? 'text-primary-600 font-semibold bg-primary-50 scale-105' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
