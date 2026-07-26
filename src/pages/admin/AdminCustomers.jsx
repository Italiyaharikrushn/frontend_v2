import React, { useState } from 'react';
import { MessageSquare, Users, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetAllMessagesQuery, useReplyToMessageMutation } from '../../api/contactApi';
import { useGetCustomersQuery } from '../../api/authApi';
import { useToast } from '../../components/ui/ToastProvider';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminCustomers = () => {
  const { pushToast } = useToast();
  const { data: messages = [], isLoading: isLoadingMessages, refetch } = useGetAllMessagesQuery();
  const { data: realCustomers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const [replyToMessage] = useReplyToMessageMutation();

  const handleReply = async (id) => {
    const replyText = window.prompt("Enter your reply message:");
    if (replyText) {
      try {
        await replyToMessage({ id, replyText }).unwrap();
        pushToast('Reply sent successfully!', 'success');
      } catch (err) {
        console.error('Failed to send reply:', err);
        pushToast('Failed to send reply.', 'error');
      }
    }
  };

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
