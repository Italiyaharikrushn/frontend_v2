import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Smartphone, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

const PaymentModal = ({ isOpen, onClose, paymentMethod, total, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const paymentNames = {
    gpay: 'Google Pay',
    paytm: 'Paytm',
    phonepe: 'PhonePe'
  };

  const selectedMethodName = paymentNames[paymentMethod] || (paymentMethod ? paymentMethod.toUpperCase() : 'Selected Method');

  return createPortal(
    <div
      className="payment-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="payment-modal-card">
        <button
          onClick={onClose}
          className="payment-modal-close"
          aria-label="Close payment modal"
          type="button"
        >
          <X size={20} />
        </button>

        <div className="payment-modal-header">
          <div className="payment-modal-icon-badge">
            <Smartphone size={32} />
          </div>
          <h2 id="payment-modal-title" className="payment-modal-title">
            Complete Payment
          </h2>
          <p className="payment-modal-subtitle">
            You selected <strong style={{ color: 'var(--text-main)' }}>{selectedMethodName}</strong>
          </p>
        </div>

        <div className="payment-modal-amount-box">
          <span className="payment-modal-amount-label">Total Amount to Pay</span>
          <span className="payment-modal-amount-value">₹{total.toFixed(2)}</span>
        </div>

        <p className="payment-modal-instructions">
          Please approve and complete the transaction in your {selectedMethodName} app to confirm your order.
        </p>

        <Button
          onClick={onConfirm}
          variant="primary"
          size="lg"
          fullWidth
          className="payment-modal-confirm-btn"
        >
          <CheckCircle2 size={20} />
          Confirm Payment
        </Button>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;
