import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin pages
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Accounts from '../pages/admin/Accounts';
import Loans from '../pages/admin/Loans';
import Audit from '../pages/admin/Audit';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="loans" element={<Loans />} />
      <Route path="audit" element={<Audit />} />
    </Routes>
  );
};

export default AdminRoutes;