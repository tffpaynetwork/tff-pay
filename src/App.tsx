import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleRoute } from './components/protected/RoleRoute';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';

import { Dashboard } from './pages/user/Dashboard';
import { Tasks } from './pages/user/Tasks';
import { Wallet } from './pages/user/Wallet';
import { Referral } from './pages/user/Referral';
import { History } from './pages/user/History';

import { AdminDashboard } from './pages/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { userProfile } = useAuth();

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-500 selection:text-white">
      <Navbar />

      <main>
        {isAdmin ? (
          <>
            {activeTab === 'admin_dash' || activeTab === 'dashboard' ? <AdminDashboard /> : null}
            {activeTab === 'admin_tasks' || activeTab === 'tasks' ? <AdminDashboard /> : null}
            {activeTab === 'admin_subs' || activeTab === 'history' ? <AdminDashboard /> : null}
            {activeTab === 'admin_withdrawals' || activeTab === 'wallet' ? <AdminDashboard /> : null}
            {activeTab === 'admin_users' || activeTab === 'referral' ? <AdminDashboard /> : null}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'tasks' && <Tasks />}
            {activeTab === 'history' && <History />}
            {activeTab === 'wallet' && <Wallet />}
            {activeTab === 'referral' && <Referral />}
          </>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route 
            path="/dashboard" 
            element={
              <RoleRoute>
                <MainLayout />
              </RoleRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <RoleRoute requiredRole="admin">
                <MainLayout />
              </RoleRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
