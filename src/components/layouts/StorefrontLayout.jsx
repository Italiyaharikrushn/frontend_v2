import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';

const StorefrontLayout = () => {
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  return (
    <div className="storefront-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', marginTop: '4rem', borderTop: '1px solid var(--border)' }}>
        <p>&copy; {new Date().getFullYear()} {storeSettings?.storeName || 'Kiya Accessories'}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
