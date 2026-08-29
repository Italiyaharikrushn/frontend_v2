import React from 'react';
import { Mail } from 'lucide-react';
import Button from './../common/Button';

const AdminCustomerMessages = ({ messages, isLoadingMessages, handleReply }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '570px', overflowY: 'auto', paddingRight: '0.5rem' }}>
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
            <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600' }}>
              <strong>Replied:</strong> {msg.adminReply}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button variant="primary" size="sm" onClick={() => handleReply(msg.id)} style={{ flex: '1 1 180px' }}>Reply</Button>
              <button className="admin-icon-btn" title="Send Email"><Mail size={16} /></button>
            </div>
          )}
        </div>
      )) : (
        <p style={{ color: 'var(--text-muted)' }}>No messages found.</p>
      )}
    </div>
  );
};

export default AdminCustomerMessages;
