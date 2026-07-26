import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import '@/styles/css/pages/admin/AdminStyles.css';

const salesData = [
  { month: 'Jan', offline: 4000, online: 2400 },
  { month: 'Feb', offline: 3000, online: 1398 },
  { month: 'Mar', offline: 2000, online: 9800 },
  { month: 'Apr', offline: 2780, online: 3908 },
  { month: 'May', offline: 1890, online: 4800 },
  { month: 'Jun', offline: 2390, online: 3800 },
];

const AdminReports = () => {
  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Sales Reports & Analysis</h1>
        <div className="admin-actions">
          <Button variant="ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Calendar size={18} /> Last 6 Months
          </Button>
          <Button variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Download size={18} /> Download Report
          </Button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-panel chart-card">
          <h2 className="chart-title">Online vs Offline Sales (Column)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="online" name="Online Store" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offline" name="Physical Store" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel chart-card">
          <h2 className="chart-title">Revenue Growth (Line)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="online" name="Online Growth" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="offline" name="Offline Growth" stroke="var(--accent)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
