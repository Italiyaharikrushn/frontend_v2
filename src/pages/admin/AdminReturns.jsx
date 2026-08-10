import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, RotateCcw, Loader } from 'lucide-react';
import { useGetAllReturnRequestsQuery, useUpdateReturnStatusMutation } from '../../api/returnApi';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import '@/styles/pages/admin/AdminStyles.css';

const AdminReturns = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { data: requestsData, isLoading } = useGetAllReturnRequestsQuery();
  const [updateReturnStatus, { isLoading: isUpdating }] = useUpdateReturnStatusMutation();

  const requests = requestsData || [];

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReturnStatus({ 
        id, 
        statusData: { status, adminComments: `Return ${status.toLowerCase()} by admin` } 
      }).unwrap();
      pushToast(`Return request ${status.toLowerCase()} successfully.`, status === 'APPROVED' ? 'success' : 'error');
    } catch (error) {
      console.error('Failed to update return status', error);
      pushToast('Failed to update return request status.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <Loader className="spin" size={24} color="var(--primary)" /> Loading Return Requests...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="admin-section-icon">
              <RotateCcw size={20} />
            </span>
            Return Requests
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review, approve, or reject customer product return requests
          </p>
        </div>
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
                    <span className={`status-badge ${
                      req.status === 'APPROVED' ? 'status-active' : 
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
      </div>
    </div>
  );
};

export default AdminReturns;

