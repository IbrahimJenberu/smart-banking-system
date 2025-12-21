import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Manager pages
import Dashboard from '../pages/manager/Dashboard';
import Analytics from '../pages/manager/Analytics';
import HighValueTransactions from '../pages/manager/HighValueTransactions';
import Reports from '../pages/manager/Reports';

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="high-value-transactions" element={<HighValueTransactions />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
};

export default ManagerRoutes;