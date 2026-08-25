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
import AboutUs from '../pages/storefront/AboutUs';
import Checkout from '../pages/storefront/Checkout';
import OrderHistory from '../pages/storefront/OrderHistory';
import PolicyPage from '../pages/storefront/PolicyPage';
import AddressBook from '../pages/storefront/AddressBook';
import AccountSettings from '../pages/storefront/AccountSettings';
import Favorites from '../pages/storefront/Favorites';
import MyMessages from '../pages/storefront/MyMessages';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="policies/:type" element={<PolicyPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="addresses" element={<AddressBook />} />
          <Route path="profile" element={<AccountSettings />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="messages" element={<MyMessages />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
