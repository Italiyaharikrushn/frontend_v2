import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../admin/Sidebar';
import { Bell, Menu, User, X } from 'lucide-react';
import '@/styles/css/components/DashboardLayout.css';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';

const DashboardLayout = () => {
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <div className={`dashboard-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <Sidebar isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen((prev) => !prev)} aria-label="Toggle sidebar">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="dashboard-brand-container">
            <h2 className="sidebar-brand">{storeSettings?.storeName} ADMIN</h2>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-badge" />
            </button>
            <div className="user-profile">
              <div className="avatar"><User size={20} /></div>
            </div>
          </div>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
