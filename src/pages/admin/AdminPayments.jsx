import React, { useState } from 'react';
import { IndianRupee, Wallet, Calendar, CalendarDays } from 'lucide-react';
import { useGetSellerPaymentsQuery, useGetSellerPaymentStatsQuery } from '../../api/paymentApi';
import Pagination from '../../components/ui/Pagination';
import '@/styles/pages/admin/AdminStyles.css';

const AdminPayments = () => {
  const [page, setPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const size = 10;
  
  const queryParams = { 
    page: page - 1, 
    size,
    ...(selectedYear && { year: parseInt(selectedYear) }),
    ...(selectedMonth && { month: parseInt(selectedMonth) }),
    ...(selectedDay && { day: parseInt(selectedDay) })
  };

  const { data, isLoading, isFetching } = useGetSellerPaymentsQuery(queryParams);
  const { data: statsData, isLoading: isLoadingStats } = useGetSellerPaymentStatsQuery(queryParams);

  const payments = data?.content || [];
  const totalPages = data?.totalPages || 1;

  // Dynamic titles based on selection
  let dayTitle = "Today's Payments";
  let monthTitle = "This Month";
  let yearTitle = "This Year";

  if (selectedYear) {
    yearTitle = `Year ${selectedYear}`;
    monthTitle = selectedMonth ? new Date(2000, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' }) : 'Selected Year';
    dayTitle = selectedDay ? `${selectedDay} ${new Date(2000, selectedMonth - 1, 1).toLocaleString('default', { month: 'short' })}` : (selectedMonth ? 'Selected Month' : 'Selected Year');
  }

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
            {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(y => (
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
            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
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
            {Array.from({length: 31}, (_, i) => i + 1).map(d => (
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
        {isLoading || isFetching ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading payments...
          </div>
        ) : payments.length > 0 ? (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover-lift">
                      <td style={{ fontWeight: '500' }}>{payment.orderId}</td>
                      <td>{payment.customerName}</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: 'var(--radius-sm)', 
                          backgroundColor: 'var(--surface-alt)', 
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {payment.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                        ₹{payment.totalAmount?.toFixed(2)}
                      </td>
                      <td>
                        {payment.orderDate ? new Date(payment.orderDate).toLocaleString() : 'N/A'}
                      </td>
                      <td>
                         <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: 'var(--radius-sm)', 
                          backgroundColor: payment.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                          color: payment.status === 'DELIVERED' ? '#10b981' : '#f59e0b',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {payment.status === 'DELIVERED' ? 'Settled' : 'Pending/COD'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <IndianRupee size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No payments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
