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
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/return-policy" style={{ color: 'var(--primary-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Return Policy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} {storeSettings?.settings?.storeSettings?.storeName}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
