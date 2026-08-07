import React from 'react';
import { Package, Clock, IndianRupee, RotateCcw, Wallet } from 'lucide-react';
import { useDashboardHome } from '../../hooks/useDashboardHome';
import '@/styles/pages/admin/AdminStyles.css';

const DashboardHome = () => {
  const { stats, isLoading, navigate } = useDashboardHome();

  if (isLoading) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Dashboard Overview</h1>
      </div>

      <div className="summary-grid">
        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/products')} style={{ cursor: 'pointer' }}>
          <div className="summary-info">
            <h3>Active Products</h3>
            <div className="summary-value">{stats.activeProducts}</div>
          </div>
          <div className="summary-icon summary-icon-primary"><Package size={24} /></div>
        </div>
        
        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
          <div className="summary-info">
            <h3>Pending Orders</h3>
            <div className="summary-value">{stats.pendingOrders}</div>
          </div>
          <div className="summary-icon summary-icon-warning"><Clock size={24} /></div>
        </div>

        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
          <div className="summary-info">
            <h3>Total Sales</h3>
            <div className="summary-value">₹{stats.totalSales.toLocaleString()}</div>
          </div>
          <div className="summary-icon summary-icon-success"><IndianRupee size={24} /></div>
        </div>

        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/returns')} style={{ cursor: 'pointer' }}>
          <div className="summary-info">
            <h3>Returns</h3>
            <div className="summary-value">{stats.returnedOrders}</div>
          </div>
          <div className="summary-icon summary-icon-error"><RotateCcw size={24} /></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
