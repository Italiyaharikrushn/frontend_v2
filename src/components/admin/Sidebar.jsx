import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, X, Tag, Ticket } from 'lucide-react';
import '@/styles/components/Sidebar.css';

import CraftyLogo from '../common/CraftyLogo';

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CraftyLogo size={32} />
          <span style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase' }}>ADMIN</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/discount" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Tag size={20} />
          <span>Discount</span>
        </NavLink>
        <NavLink to="/admin/coupons" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Ticket size={20} />
          <span>Coupons</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/customers" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">

        <button className="sidebar-link text-error" onClick={() => { handleLogout(); handleNavClick(); }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
