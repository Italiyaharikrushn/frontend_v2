import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import AdminCustomerTable from '../../components/admin/AdminCustomerTable';
import AdminCustomerMessages from '../../components/admin/AdminCustomerMessages';
import { useAdminCustomers } from '../../hooks/useAdminCustomers';
import '@/styles/pages/admin/AdminStyles.css';

const AdminCustomers = () => {
  const {
    messages,
    isLoadingMessages,
    realCustomers,
    isLoadingCustomers,
    handleReply
  } = useAdminCustomers();

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Customers & Support</h1>
      </div>

      <div className="admin-two-column">
        <div className="glass-panel admin-panel-card" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem', fontWait: '700' }}>
            <span className="admin-section-icon"><Users size={18} /></span> Customer Directory
          </h2>

          <AdminCustomerTable realCustomers={realCustomers} isLoadingCustomers={isLoadingCustomers} />
        </div>

        <div className="glass-panel admin-panel-card">
          <h2 style={{ marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: '700' }}>
            <span className="admin-section-icon"><MessageSquare size={18} /></span> Customer Messages
          </h2>

          <AdminCustomerMessages messages={messages} isLoadingMessages={isLoadingMessages} handleReply={handleReply} />
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
