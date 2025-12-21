import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

const RoleGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading or spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAllowedRole = allowedRoles.includes(user?.role);

  if (!hasAllowedRole) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'CUSTOMER') {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'MANAGER') {
      return <Navigate to="/manager/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If user has allowed role, render the child routes
  return <Outlet />;
};

export default RoleGuard;