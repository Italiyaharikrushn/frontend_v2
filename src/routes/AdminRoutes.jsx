import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protected Route
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Admin Pages
import DashboardHome from '../pages/admin/DashboardHome';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminPromotions from '../pages/admin/AdminPromotions';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminChangePassword from '../pages/admin/AdminChangePassword';
import AdminPolicies from '../pages/admin/AdminPolicies';
import AdminReturns from '../pages/admin/AdminReturns';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="returns" element={<AdminReturns />} />
          <Route path="policies" element={<AdminPolicies />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="change-password" element={<AdminChangePassword />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
