import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Protected Route
import StorefrontLayout from '@/components/layouts/StorefrontLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Storefront Pages
import Home from './Home';
import Products from './Products';
import ProductDetails from './ProductDetails';
import Cart from './Cart';
import Contact from './Contact';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="contact" element={<Contact />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
