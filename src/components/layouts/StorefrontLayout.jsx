import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
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
        <p>&copy; {new Date().getFullYear()} {storeSettings?.settings?.storeSettings?.storeName}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
