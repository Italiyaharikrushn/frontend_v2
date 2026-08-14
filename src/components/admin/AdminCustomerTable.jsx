import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const AdminCustomerTable = ({ realCustomers, isLoadingCustomers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // If phone starts with + and 1-3 digits (country code) followed by digits without space
    const match = phone.match(/^(\+\d{1,3})(\d+)$/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return phone;
  };

  return (
    <>
      <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Joining Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoadingCustomers ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading customers...</td>
            </tr>
          ) : realCustomers.length > 0 ? (
            realCustomers.map(customer => (
              <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} style={{ cursor: 'pointer' }} className="hover-row">
                <td style={{ color: 'var(--text-muted)' }}>
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ fontWeight: '600' }}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{formatPhoneNumber(customer.phone)}</td>
                <td>
                  <span className={(customer.active ?? customer.isActive ?? true) ? 'status-badge status-active' : 'status-badge status-inactive'}>
                    {(customer.active ?? customer.isActive ?? true) ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No customers found</td>
            </tr>
          )}
        </tbody>
      </table>

      </div>

      {selectedCustomer && createPortal(
        <div className="admin-modal-backdrop" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>Customer Details</h3>
              <button className="admin-modal-close" onClick={() => setSelectedCustomer(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="customer-detail-list">
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Total Orders</span>
                  <span className="customer-detail-value" style={{ fontSize: '1.1rem' }}>{selectedCustomer.orders || 0}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Total Spent</span>
                  <span className="customer-detail-value" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{selectedCustomer.spent || '₹0'}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Contact Number</span>
                  <span className="customer-detail-value">{formatPhoneNumber(selectedCustomer.phone)}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Last Order Date</span>
                  <span className="customer-detail-value">
                    {selectedCustomer.lastOrderDate ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.9rem' }}>Recent Orders</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedCustomer.recentOrders.map(order => (
                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{order.orderId}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{new Date(order.orderDate).toLocaleDateString()}</span>
                          <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AdminCustomerTable;
