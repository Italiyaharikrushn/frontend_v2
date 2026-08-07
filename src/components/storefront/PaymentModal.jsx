import React from 'react';
import { X, Smartphone, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

const PaymentModal = ({ isOpen, onClose, paymentMethod, total, onConfirm }) => {
  if (!isOpen) return null;

  const paymentNames = {
    gpay: 'Google Pay',
    paytm: 'Paytm',
    phonepe: 'PhonePe'
  };

  return (
    <div className="modal-overlay fade-in" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="modal-content glass-panel" style={{ 
        width: '90%', 
        maxWidth: '400px', 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2rem', 
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <button onClick={onClose} style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          borderRadius: '50%'
        }}>
          <X size={20} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1rem' 
          }}>
            <Smartphone size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Complete Payment</h2>
          <p style={{ color: 'var(--text-muted)' }}>You selected {paymentNames[paymentMethod] || paymentMethod}</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          textAlign: 'center', 
          marginBottom: '2rem',
          border: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Amount to pay</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>₹{total.toFixed(2)}</p>
        </div>
        
        <p style={{ fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Please complete the payment using your mobile app to confirm your order.
        </p>
        
        <Button onClick={onConfirm} variant="primary" size="lg" fullWidth style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={20} />
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentModal;
