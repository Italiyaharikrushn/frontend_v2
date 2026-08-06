import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Protected Route
import StorefrontLayout from '@/components/layouts/StorefrontLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Storefront Pages
import Home from '../pages/storefront/Home';
import Products from '../pages/storefront/Products';
import ProductDetails from '../pages/storefront/ProductDetails';
import Cart from '../pages/storefront/Cart';
import Contact from '../pages/storefront/Contact';
import Checkout from '../pages/storefront/Checkout';
import OrderHistory from '../pages/storefront/OrderHistory';
import ReturnPolicyPage from '../pages/storefront/ReturnPolicyPage';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="contact" element={<Contact />} />
        <Route path="return-policy" element={<ReturnPolicyPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
