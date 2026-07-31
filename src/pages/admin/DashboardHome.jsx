import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, IndianRupee, RotateCcw } from 'lucide-react';
import { useGetProductsQuery } from '../../api/productApi';
import { useGetSellerOrdersQuery } from '../../api/orderApi';
import '@/styles/css/pages/admin/AdminStyles.css';

const DashboardHome = () => {
  const { data: products = [], isLoading: isLoadingProducts } = useGetProductsQuery();
  const { data: orders = [], isLoading: isLoadingOrders } = useGetSellerOrdersQuery();
  const navigate = useNavigate();

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const activeProducts = products.length; // Assuming all returned are active for now
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const returnedOrders = orders.filter(o => o.status === 'RETURNED').length;
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      activeProducts,
      pendingOrders,
      returnedOrders,
      totalSales
    };
  }, [products, orders]);

  if (isLoadingProducts || isLoadingOrders) {
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

        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
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
