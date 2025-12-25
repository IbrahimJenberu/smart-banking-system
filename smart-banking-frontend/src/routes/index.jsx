import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Guards
import AuthGuard from '../auth/AuthGuard';
import RoleGuard from '../auth/RoleGuard';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Public Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Customer Pages
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerAccounts from '../pages/customer/Accounts';
import CustomerTransactions from '../pages/customer/Transactions';
import CustomerTransfers from '../pages/customer/Transfers';
import CustomerLoans from '../pages/customer/Loans';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminAccounts from '../pages/admin/Accounts';
import AdminLoans from '../pages/admin/Loans';
import AdminAudit from '../pages/admin/Audit';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';
import ManagerAnalytics from '../pages/manager/Analytics';
import ManagerHighValue from '../pages/manager/HighValueTransactions';
import ManagerReports from '../pages/manager/Reports';

// Common Pages
import Profile from '../pages/customer/Profile'; // Fixed path
import NotFound from '../pages/NotFound'; // You need to create this

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------- PROTECTED ---------- */}
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>

          {/* CUSTOMER ROUTES */}
          <Route element={<RoleGuard allowedRoles={['CUSTOMER']} />}>
            <Route path="/customer">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="accounts" element={<CustomerAccounts />} />
              <Route path="transactions" element={<CustomerTransactions />} />
              <Route path="transfers" element={<CustomerTransfers />} />
              <Route path="loans" element={<CustomerLoans />} />
              <Route path="profile" element={<Profile />} /> {/* Moved inside customer */}
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path="/admin">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="loans" element={<AdminLoans />} />
              <Route path="audit" element={<AdminAudit />} />
            </Route>
          </Route>

          {/* MANAGER ROUTES */}
          <Route element={<RoleGuard allowedRoles={['MANAGER']} />}>
            <Route path="/manager">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="analytics" element={<ManagerAnalytics />} />
              <Route path="high-value-transactions" element={<ManagerHighValue />} />
              <Route path="reports" element={<ManagerReports />} />
            </Route>
          </Route>

        </Route>
      </Route>

      {/* TEST ROUTE */}
      <Route path="/test" element={<h1 className="text-3xl p-10">ROUTER WORKS</h1>} />

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;