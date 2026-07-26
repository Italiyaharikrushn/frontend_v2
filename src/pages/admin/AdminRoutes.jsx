import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protected Route
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Admin Pages
import DashboardHome from './DashboardHome';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminReports from './AdminReports';
import AdminSettings from './AdminSettings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
