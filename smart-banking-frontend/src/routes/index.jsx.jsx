import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Guards
import AuthGuard from '../auth/AuthGuard';
import RoleGuard from '../auth/RoleGuard';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';

// Public Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Customer Pages
import CustomerRoutes from './CustomerRoutes';

// Admin Pages
import AdminRoutes from './AdminRoutes';

// Manager Pages
import ManagerRoutes from './ManagerRoutes';

// Common Pages
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Routes */}
      <Route element={<AuthGuard />}>
        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          {/* Customer Routes */}
          <Route element={<RoleGuard allowedRoles={['CUSTOMER']} />}>
            <Route path="/customer/*" element={<CustomerRoutes />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>
          
          {/* Manager Routes */}
          <Route element={<RoleGuard allowedRoles={['MANAGER']} />}>
            <Route path="/manager/*" element={<ManagerRoutes />} />
          </Route>
          
          {/* Common Routes */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;