import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StorefrontLayout from '../components/layouts/StorefrontLayout';

// Pages
import Home from '../pages/storefront/Home';
import Products from '../pages/storefront/Products';
import Cart from '../pages/storefront/Cart';
import Contact from '../pages/storefront/Contact';
import Checkout from '../pages/storefront/Checkout';
import OrderHistory from '../pages/storefront/OrderHistory';
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardHome from '../pages/admin/DashboardHome';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Storefront Routes */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="contact" element={<Contact />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>
        </Route>

        {/* Admin/Seller Dashboard Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
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

        {/* 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
