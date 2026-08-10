import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../redux/authSlice';
import Header from '../common/Header';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';

const StorefrontLayout = () => {
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  const userRole = useSelector(selectUserRole);

  if (userRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="storefront-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <footer style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Link to="/policies/return-and-refund" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Return & Refund Policy</Link>
          <Link to="/policies/terms-of-service" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link>
          <Link to="/policies/shipping-policy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Shipping Policy</Link>
          <Link to="/policies/contact-information" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Information</Link>
          <Link to="/policies/legal-notice" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Legal Notice</Link>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} {storeSettings?.settings?.storeSettings?.storeName || 'Store'}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
