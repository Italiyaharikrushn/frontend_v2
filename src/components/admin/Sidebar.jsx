import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, X } from 'lucide-react';
import '@/styles/css/components/Sidebar.css';

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-brand">KIYA Admin</h2>
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
