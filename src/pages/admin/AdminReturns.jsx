import React from 'react';
import { RotateCcw, Loader } from 'lucide-react';
import { useAdminReturns } from '../../hooks/useAdminReturns';
import AdminReturnTable from '../../components/admin/AdminReturnTable';
import '@/styles/pages/admin/AdminStyles.css';

const AdminReturns = () => {
  const { requests, isLoading, handleUpdateStatus } = useAdminReturns();

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
        <AdminReturnTable requests={requests} handleUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  );
};

export default AdminReturns;
