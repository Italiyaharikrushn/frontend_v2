import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Protected Route
import CustomerLayout from '@/components/layouts/CustomerLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// customer Pages
import Home from '../pages/customer/Home';
import Products from '../pages/customer/Products';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Contact from '../pages/customer/Contact';
import AboutUs from '../pages/customer/AboutUs';
import Checkout from '../pages/customer/Checkout';
import OrderHistory from '../pages/customer/OrderHistory';
import PolicyPage from '../pages/customer/PolicyPage';
import AddressBook from '../pages/customer/AddressBook';
import AccountSettings from '../pages/customer/AccountSettings';
import Favorites from '../pages/customer/Favorites';
import MyMessages from '../pages/customer/MyMessages';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="policies/:type" element={<PolicyPage />} />
        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
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
