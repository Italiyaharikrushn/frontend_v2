import React, { useState } from 'react';
import { MessageSquare, Users, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetAllMessagesQuery, useReplyToMessageMutation } from '../../api/contactApi';
import { useGetCustomersQuery } from '../../api/authApi';
import './AdminStyles.css';

const AdminCustomers = () => {
  const { data: messages = [], isLoading: isLoadingMessages, refetch } = useGetAllMessagesQuery();
  const { data: realCustomers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const [replyToMessage] = useReplyToMessageMutation();

  const handleReply = async (id) => {
    const replyText = window.prompt("Enter your reply message:");
    if (replyText) {
      try {
        await replyToMessage({ id, replyText }).unwrap();
        alert('Reply sent successfully!');
      } catch (err) {
        console.error('Failed to send reply:', err);
        alert('Failed to send reply.');
      }
    }
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Customers & Support</h1>
      </div>

      <div className="admin-two-column">
        {/* Main Customers List */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                      <td style={{ fontWeight: '500' }}>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.orders || 0}</td>
                      <td>{customer.spent || '₹0'}</td>
                      <td>
                        <span className={`status-badge status-active`}>
                          Active
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
        </div>

        {/* Sidebar Messages Area */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Customer Messages
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isLoadingMessages ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading messages...</p>
            ) : messages.length > 0 ? messages.map(msg => (
              <div key={msg.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{msg.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <strong>Subject:</strong> {msg.subject} | <strong>Email:</strong> {msg.email}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>"{msg.message}"</p>
                
                {msg.status === 'REPLIED' ? (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0fdf4', color: '#166534', borderRadius: '4px', fontSize: '0.8rem' }}>
                    <strong>Replied:</strong> {msg.adminReply}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary" size="sm" onClick={() => handleReply(msg.id)} style={{ flex: 1 }}>Reply</Button>
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
