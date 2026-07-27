import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Common Auth Pages (lazy loaded)
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Route Modules (lazy loaded)
const CustomerRoutes = lazy(() => import('./CustomerRoutes'));
const AdminRoutes = lazy(() => import('./AdminRoutes'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
    Loading...
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
