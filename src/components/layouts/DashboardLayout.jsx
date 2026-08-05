import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserName, selectUserEmail } from '../../redux/authSlice';
import Sidebar from '../admin/Sidebar';
import { Bell, Menu, X, Settings, Lock } from 'lucide-react';
import '@/styles/components/DashboardLayout.css';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';
import { getMediaUrl } from '../../utils/apiHelpers';

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

  let avatarInitial = '';
  if (userName) {
    avatarInitial = userName.charAt(0).toUpperCase();
  } else if (userEmail) {
    avatarInitial = userEmail.charAt(0).toUpperCase();
  } else {
    avatarInitial = 'A';
  }

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
            <h2 className="sidebar-brand">{storeSettings?.storeName}</h2>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-badge" />
            </button>
            <div className="user-profile" ref={profileRef} style={{ position: 'relative' }}>
              <div className="avatar" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #c5a059 0%, #a07d3b 100%)', color: '#0d0c0a', fontWeight: 'bold', overflow: 'hidden' }}>
                {storeSettings?.profilePhoto ? (
                  <img src={getMediaUrl(storeSettings.profilePhoto)} alt="Store" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  avatarInitial
                )}
              </div>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    {userName && <div className="profile-name">{userName}</div>}
                    {userEmail && <div className="profile-email">{userEmail}</div>}
                    {!userName && !userEmail && <div className="profile-name">Admin</div>}
                  </div>
                  <div className="profile-dropdown-divider" />
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
