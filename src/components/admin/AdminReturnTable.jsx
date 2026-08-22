import React from 'react';
import { Check, X } from 'lucide-react';

const AdminReturnTable = ({ requests, handleUpdateStatus }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Reason</th>
            <th>Details</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? requests.map((req) => (
            <tr key={req.id}>
              <td style={{ fontWeight: '600' }}>#{req.order?.orderId || req.orderId}</td>
              <td>{req.user?.name || 'Customer'}</td>
              <td>{req.reason}</td>
              <td style={{ maxWidth: '280px' }}>{req.details || 'No additional details provided'}</td>
              <td>{new Date(req.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge ${req.status === 'APPROVED' ? 'status-active' :
                  req.status === 'REJECTED' ? 'status-inactive' : 'status-pending'
                  }`}>
                  {req.status}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                {req.status === 'PENDING' ? (
                  <div className="admin-table-actions" style={{ justifyContent: 'center' }}>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                      className="admin-icon-btn"
                      title="Approve Return"
                      style={{ color: 'var(--success)' }}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      className="admin-icon-btn admin-icon-btn-danger"
                      title="Reject Return"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Completed</span>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No return requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReturnTable;
