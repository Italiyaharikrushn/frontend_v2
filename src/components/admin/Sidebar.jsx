import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, X, Tag, RotateCcw, FileText, IndianRupee, BarChart2, Star } from 'lucide-react';
import '@/styles/components/Sidebar.css';

import CraftyLogo from '../common/CraftyLogo';

const Sidebar = ({ isMobileOpen = false, onClose = () => { } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
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
        <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/payments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <IndianRupee size={20} />
          <span>Payments</span>
        </NavLink>
        <NavLink to="/admin/promotions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Tag size={20} />
          <span>Promotions</span>
        </NavLink>
        <NavLink to="/admin/customers" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <BarChart2 size={20} />
          <span>Reports</span>
        </NavLink>
        <NavLink to="/admin/reviews" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <Star size={20} />
          <span>Reviews</span>
        </NavLink>
        <NavLink to="/admin/returns" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <RotateCcw size={20} />
          <span>Returns</span>
        </NavLink>
        <NavLink to="/admin/policies" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <FileText size={20} />
          <span>Store Policies</span>
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
