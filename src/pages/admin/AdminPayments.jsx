import React from 'react';
import { Wallet, Calendar, CalendarDays } from 'lucide-react';
import { useAdminPayments } from '../../hooks/useAdminPayments';
import AdminPaymentTable from '../../components/admin/AdminPaymentTable';
import '@/styles/pages/admin/AdminStyles.css';
import { getCurrentYear } from '../../utils/dateUtils';

const AdminPayments = () => {
  const {
    page,
    setPage,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDay,
    setSelectedDay,
    payments,
    isLoading,
    isFetching,
    statsData,
    isLoadingStats,
    dayTitle,
    monthTitle,
    yearTitle
  } = useAdminPayments();

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="admin-title">Payments Received</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            className="admin-filter-select"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
          >
            <option value="">All Years</option>
            {Array.from({ length: 10 }, (_, i) => getCurrentYear() - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            className="admin-filter-select"
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); setPage(1); }}
            disabled={!selectedYear}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>

          <select
            className="admin-filter-select"
            value={selectedDay}
            onChange={(e) => { setSelectedDay(e.target.value); setPage(1); }}
            disabled={!selectedMonth}
          >
            <option value="">All Days</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {(selectedYear || selectedMonth || selectedDay) && (
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
              onClick={() => { setSelectedYear(''); setSelectedMonth(''); setSelectedDay(''); setPage(1); }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="summary-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="summary-card glass-panel hover-lift">
          <div className="summary-info">
            <h3>{dayTitle}</h3>
            <div className="summary-value">
              {isLoadingStats ? '...' : `₹${(statsData?.todaySales || 0).toLocaleString()}`}
            </div>
          </div>
          <div className="summary-icon summary-icon-success"><Wallet size={24} /></div>
        </div>
        <div className="summary-card glass-panel hover-lift">
          <div className="summary-info">
            <h3>{monthTitle}</h3>
            <div className="summary-value">
              {isLoadingStats ? '...' : `₹${(statsData?.thisMonthSales || 0).toLocaleString()}`}
            </div>
          </div>
          <div className="summary-icon summary-icon-primary"><CalendarDays size={24} /></div>
        </div>
        <div className="summary-card glass-panel hover-lift">
          <div className="summary-info">
            <h3>{yearTitle}</h3>
            <div className="summary-value">
              {isLoadingStats ? '...' : `₹${(statsData?.thisYearSales || 0).toLocaleString()}`}
            </div>
          </div>
          <div className="summary-icon summary-icon-warning"><Calendar size={24} /></div>
        </div>
      </div>

      <div className="glass-panel admin-panel-card admin-full-height-card">
        <AdminPaymentTable payments={payments} isLoading={isLoading} isFetching={isFetching} />
      </div>
    </div>
  );
};

export default AdminPayments;
