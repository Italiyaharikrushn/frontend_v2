import React from 'react';
import { useGetMyMessagesQuery } from '../../api/contactApi';
import { Mail, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

const MyMessages = () => {
    const { data: messages, isLoading, error } = useGetMyMessagesQuery();

    if (isLoading) {
        return (
            <div className="crafty-container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="crafty-container" style={{ minHeight: '60vh', padding: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <p style={{ color: 'var(--error)' }}>Failed to load messages. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="crafty-container" style={{ padding: '2rem 1rem', minHeight: '70vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={32} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Support Messages</h1>
                </div>

                {(!messages || messages.length === 0) ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '4rem 2rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <MessageCircle size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No messages yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>When you contact support, your conversation history will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                background: 'var(--bg-card)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow-md)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                                            {msg.subject}
                                        </h3>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '99px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        background: msg.status === 'REPLIED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: msg.status === 'REPLIED' ? 'var(--success)' : 'var(--warning)',
                                        border: `1px solid ${msg.status === 'REPLIED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                    }}>
                                        {msg.status === 'REPLIED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                        {msg.status === 'REPLIED' ? 'Answered' : 'Pending'}
                                    </div>
                                </div>
                                
                                <div style={{ 
                                    background: 'var(--bg-secondary)', 
                                    padding: '1rem', 
                                    borderRadius: '8px', 
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    marginBottom: msg.adminReply ? '1rem' : '0'
                                }}>
                                    {msg.message}
                                </div>

                                {msg.adminReply && (
                                    <div style={{
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid var(--border)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <div style={{ 
                                                width: '28px', 
                                                height: '28px', 
                                                borderRadius: '50%', 
                                                background: 'var(--primary)', 
                                                color: 'white', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                A
                                            </div>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Admin Reply</span>
                                        </div>
                                        <div style={{
                                            background: 'rgba(var(--primary-rgb), 0.05)',
                                            borderLeft: '4px solid var(--primary)',
                                            padding: '1rem',
                                            borderRadius: '0 8px 8px 0',
                                            color: 'var(--text-primary)',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {msg.adminReply}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyMessages;
