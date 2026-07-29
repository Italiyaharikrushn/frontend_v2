import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserName, selectUserEmail, logout } from '../../redux/authSlice';
import Sidebar from '../admin/Sidebar';
import { Bell, Menu, User, X, Settings, Lock, LogOut } from 'lucide-react';
import '@/styles/css/components/DashboardLayout.css';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';

const DashboardLayout = () => {
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <div className="user-profile" ref={profileRef} style={{ position: 'relative' }}>
              <div className="avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <User size={20} />
              </div>

              {isProfileOpen && (
                <div className="profile-dropdown" style={{ width: "200px" }}>
                  <Link to="/admin/settings" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <Link to="/admin/change-password" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <Lock size={16} />
                    <span>Change Password</span>
                  </Link>
                </div>
              )}
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
