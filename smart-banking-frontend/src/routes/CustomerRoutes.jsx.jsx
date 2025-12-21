import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Customer pages
import Dashboard from '../pages/customer/Dashboard';
import Accounts from '../pages/customer/Accounts';
import Transactions from '../pages/customer/Transactions';
import Transfers from '../pages/customer/Transfers';
import Loans from '../pages/customer/Loans';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="transfers" element={<Transfers />} />
      <Route path="loans" element={<Loans />} />
    </Routes>
  );
};

export default CustomerRoutes;