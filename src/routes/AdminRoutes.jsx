import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protected Route
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Admin Pages
import DashboardHome from '../pages/admin/DashboardHome';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminDiscount from '../pages/admin/AdminDiscount';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminChangePassword from '../pages/admin/AdminChangePassword';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="discount" element={<AdminDiscount />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="change-password" element={<AdminChangePassword />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
