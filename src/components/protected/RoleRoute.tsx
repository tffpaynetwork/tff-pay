import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    // Redirect to respective dashboard if role doesn't match
    return <Navigate to={userProfile?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};
