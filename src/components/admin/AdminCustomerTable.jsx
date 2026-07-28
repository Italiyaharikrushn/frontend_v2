import React from 'react';

const AdminCustomerTable = ({ realCustomers, isLoadingCustomers }) => {
  return (
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
              <tr key={customer.id}>
                <td style={{ fontWeight: '600' }}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.orders || 0}</td>
                <td>{customer.spent || '₹0'}</td>
                <td>
                  <span className="status-badge status-active">Active</span>
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
  );
};

export default AdminCustomerTable;
