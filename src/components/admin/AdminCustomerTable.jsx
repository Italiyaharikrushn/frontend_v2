import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const AdminCustomerTable = ({ realCustomers, isLoadingCustomers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <>
      <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Orders</th>
            <th>Total Spent</th>
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
                <td style={{ fontWeight: '600' }}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.orders || 0}</td>
                <td>{customer.spent || '₹0'}</td>
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
                  <span className="customer-detail-label">Name</span>
                  <span className="customer-detail-value">{selectedCustomer.name}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Email</span>
                  <span className="customer-detail-value">{selectedCustomer.email}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Phone</span>
                  <span className="customer-detail-value">{selectedCustomer.phone || 'N/A'}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Role</span>
                  <span className="customer-detail-value">{selectedCustomer.role ? selectedCustomer.role.replace('ROLE_', '') : 'CUSTOMER'}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Status</span>
                  <span className={(selectedCustomer.active ?? selectedCustomer.isActive ?? true) ? 'status-badge status-active' : 'status-badge status-inactive'}>
                    {(selectedCustomer.active ?? selectedCustomer.isActive ?? true) ? 'Active' : 'Inactive'}
                  </span>
                </div>
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
