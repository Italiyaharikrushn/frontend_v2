import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { useGetAllReturnRequestsQuery, useUpdateReturnStatusMutation } from '../../api/returnApi';
import '@/styles/pages/admin/AdminStyles.css';

const AdminReturns = () => {
  const { data: requestsData, isLoading } = useGetAllReturnRequestsQuery();
  const [updateReturnStatus] = useUpdateReturnStatusMutation();

  const requests = requestsData || [];

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReturnStatus({ id, statusData: { status, adminComments: `Return ${status.toLowerCase()}` } }).unwrap();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="admin-header">
        <h1 className="admin-title">Return Requests</h1>
      </div>

      <div className="glass-panel admin-panel-card admin-full-height-card">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.order?.orderId || req.orderId}</td>
                  <td>{req.user?.name || 'Customer'}</td>
                  <td>{req.reason}</td>
                  <td>{req.details}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${req.status === 'APPROVED' ? 'status-delivered' : req.status === 'REJECTED' ? 'status-cancelled' : 'status-pending'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'PENDING' && (
                      <div className="admin-table-actions">
                        <button onClick={() => handleUpdateStatus(req.id, 'APPROVED')} className="admin-icon-btn" title="Approve" style={{ color: 'green' }}><Check size={16} /></button>
                        <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')} className="admin-icon-btn admin-icon-btn-danger" title="Reject"><X size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No return requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReturns;
