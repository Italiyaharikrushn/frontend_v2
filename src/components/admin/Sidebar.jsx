import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
    // Force a full reload to clear any remaining in-memory state
    window.location.reload();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-brand">{'KIYA'} Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/customers" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/admin/settings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button className="sidebar-link text-error" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
