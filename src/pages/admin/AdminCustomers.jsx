import React from 'react';
import { MessageSquare, Users, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdminCustomerTable from '../../components/admin/AdminCustomerTable';
import { useAdminCustomers } from '../../hooks/useAdminCustomers';
import '@/styles/css/pages/admin/AdminStyles.css';

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
        <div className="glass-panel admin-panel-card">
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} /> Customer Directory
          </h2>

          <AdminCustomerTable realCustomers={realCustomers} isLoadingCustomers={isLoadingCustomers} />
        </div>

        <div className="glass-panel admin-panel-card" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Customer Messages
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isLoadingMessages ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading messages...</p>
            ) : messages.length > 0 ? messages.map(msg => (
              <div key={msg.id} className="admin-message-card">
                <div className="admin-message-meta">
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{msg.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Subject:</strong> {msg.subject} | <strong>Email:</strong> {msg.email}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>"{msg.message}"</p>

                {msg.status === 'REPLIED' ? (
                  <div style={{ padding: '0.6rem', background: '#f0fdf4', color: '#166534', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <strong>Replied:</strong> {msg.adminReply}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button variant="primary" size="sm" onClick={() => handleReply(msg.id)} style={{ flex: '1 1 180px' }}>Reply</Button>
                    <Button variant="secondary" size="sm" style={{ padding: '0.5rem' }}><Mail size={16} /></Button>
                  </div>
                )}
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)' }}>No messages found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
