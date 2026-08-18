import React from 'react';
import { Package, Clock, IndianRupee, RotateCcw, Wallet } from 'lucide-react';
import { useDashboardHome } from '../../hooks/useDashboardHome';
import { useGetSellerAnalyticsQuery } from '../../api/orderApi';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '@/styles/pages/admin/AdminStyles.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const DashboardHome = () => {
  const { stats, isLoading, navigate } = useDashboardHome();
  const { data: analyticsData = [], isLoading: isLoadingAnalytics } = useGetSellerAnalyticsQuery(7);

  const salesData = analyticsData.map(item => ({
    date: item.date,
    payment: item.totalPayment,
  }));

  if (isLoading || isLoadingAnalytics) {
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

      <div className="summary-grid" style={{ marginBottom: '2rem' }}>
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

        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/payments')} style={{ cursor: 'pointer' }}>
          <div className="summary-info">
            <h3>Today's Sales</h3>
            <div className="summary-value">₹{stats.todaySales.toLocaleString()}</div>
          </div>
          <div className="summary-icon summary-icon-success"><Wallet size={24} /></div>
        </div>

        <div className="summary-card glass-panel hover-lift" onClick={() => navigate('/admin/payments')} style={{ cursor: 'pointer' }}>
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

      <div className="charts-grid">
        <div className="glass-panel chart-card">
          <h2 className="chart-title">Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success, #10b981)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--success, #10b981)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="payment" name="Revenue (₹)" stroke="var(--success, #10b981)" fillOpacity={1} fill="url(#colorPayment)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel chart-card">
          <h2 className="chart-title">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
