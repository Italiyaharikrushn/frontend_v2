import React from 'react';
import { ShoppingBag, Lock } from 'lucide-react';
import Button from '../ui/Button';

const CheckoutSummary = ({ cartItems, subtotal, shipping, tax, total, isProcessing }) => {
  return (
    <div className="checkout-summary glass-panel">
      <h2 className="form-card-title">Order Summary</h2>
      <div className="summary-items">
        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <div className="summary-item-info">
              <div className="summary-item-image">
                <ShoppingBag size={20} className="product-placeholder-icon" style={{ opacity: 0.3 }} />
              </div>
              <div className="summary-item-details">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="summary-item-name">{item.name}</span>
                  {item.phoneModel && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Model: {item.phoneModel}</span>}
                </div>
                <span className="summary-item-qty">Qty: {item.quantity}</span>
              </div>
            </div>
            <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="summary-totals">
        <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="summary-row"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
        <div className="summary-row"><span>Estimated Tax (8%)</span><span>₹{tax.toFixed(2)}</span></div>
        <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        <Button type="submit" form="checkout-form" variant="primary" size="lg" fullWidth disabled={isProcessing} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {isProcessing ? 'Processing...' : (<><Lock size={18} /> Pay ₹{total.toFixed(2)}</>)}
        </Button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Your payment information is processed securely. We do not store credit card details.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
