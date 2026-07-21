import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../admin/Sidebar';
import { Bell, User, LogOut } from 'lucide-react';
import './DashboardLayout.css';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';

const DashboardLayout = () => {
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="sidebar-header">
            <h2 className="sidebar-brand">{storeSettings?.storeName || 'KIYA'} ADMIN</h2>
          </div>

          <div className="header-search">
            {/* Search can go here */}
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
              <div className="avatar"><User size={20} /></div>
              <span className="user-name">Admin</span>
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
