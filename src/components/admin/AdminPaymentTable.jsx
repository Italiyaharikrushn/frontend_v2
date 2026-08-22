import React from 'react';
import { IndianRupee } from 'lucide-react';

const AdminPaymentTable = ({ payments, isLoading, isFetching }) => {
  if (isLoading || isFetching) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading payments...
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <IndianRupee size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <p>No payments found.</p>
      </div>
    );
  }

  return (
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
                  {(payment.paymentMethod).toUpperCase()}
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
                  backgroundColor: (payment.paymentStatus === 'COMPLETED' || payment.status === 'DELIVERED') ? 'rgba(16, 185, 129, 0.1)' : payment.paymentStatus === 'FAILED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: (payment.paymentStatus === 'COMPLETED' || payment.status === 'DELIVERED') ? '#10b981' : payment.paymentStatus === 'FAILED' ? '#ef4444' : '#f59e0b',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {(payment.paymentStatus === 'COMPLETED' || payment.status === 'DELIVERED') ? 'Settled' : payment.paymentStatus === 'FAILED' ? 'Failed' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaymentTable;
