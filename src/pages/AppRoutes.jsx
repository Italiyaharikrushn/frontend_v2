import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Common Auth Pages
import Login from './auth/Login';
import Register from './auth/Register';

// Route Modules
import CustomerRoutes from './storefront/CustomerRoutes';
import AdminRoutes from './admin/AdminRoutes';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Common Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Customer Storefront Routes */}
        <Route path="/*" element={<CustomerRoutes />} />

        {/* 404 Not Found Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
