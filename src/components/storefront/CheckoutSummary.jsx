import React from 'react';
import { ShoppingBag, Lock, Tag, Ticket, CheckCircle2, AlertCircle, Truck, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

const CheckoutSummary = ({ cartItems, subtotal, shippingCharge = 0, taxPercentage = 0, taxAmount = 0, total, isProcessing, couponCode, setCouponCode, appliedCouponCode, discountAmount, couponError, validateCoupon, showPaymentSection, storePolicy }) => {
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
        <div className="summary-row"><span>Shipping</span><span>₹{shippingCharge.toFixed(2)}</span></div>
        <div className="summary-row"><span>Tax ({taxPercentage}%)</span><span>₹{taxAmount.toFixed(2)}</span></div>

        <div className="coupon-section">
          <div className="coupon-input-group">
            <Ticket size={18} className="coupon-icon" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter discount code"
              disabled={appliedCouponCode !== null}
            />
            <button
              type="button"
              onClick={validateCoupon}
              className={`coupon-btn ${appliedCouponCode ? 'coupon-btn-applied' : 'coupon-btn-apply'}`}
              disabled={appliedCouponCode !== null || !couponCode.trim()}
            >
              {appliedCouponCode ? (
                <><CheckCircle2 size={16} /> Applied</>
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {couponError && (
            <div className="coupon-message error">
              <AlertCircle size={14} />
              <span>{couponError}</span>
            </div>
          )}

          {appliedCouponCode && !couponError && (
            <div className="coupon-message success">
              <CheckCircle2 size={14} />
              <span>Discount code applied successfully!</span>
            </div>
          )}
        </div>

        {discountAmount > 0 && (
          <div className="discount-row">
            <div className="discount-row-label">
              <span>Discount</span>
              <span className="discount-tag">
                <Tag size={12} style={{ marginRight: '4px' }} />
                {appliedCouponCode}
              </span>
            </div>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

        {storePolicy && (
          <div className="policy-summary" style={{ marginTop: '1rem', marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <AlertCircle size={16} style={{ color: 'var(--primary)' }} /> Store Policies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {storePolicy.isReturnsAccepted ? (
                <p style={{ margin: 0, lineHeight: 1.4 }}>
                  <strong>Returns:</strong> Accepted within {storePolicy.returnWindow} of {storePolicy.startingFrom.toLowerCase()}. {storePolicy.returnShipping === 'Free return shipping' ? 'Free return shipping.' : storePolicy.returnShipping === 'Customer provides label' ? 'Customer must pay for return shipping.' : 'Flat rate return shipping applies.'} {storePolicy.extendWeekends && 'Extended for weekends/holidays.'}
                </p>
              ) : (
                <p style={{ margin: 0 }}><strong>Returns:</strong> Not accepted.</p>
              )}
              {storePolicy.isCancellationAccepted ? (
                <p style={{ margin: 0, lineHeight: 1.4 }}>
                  <strong>Cancellations:</strong> Allowed within {storePolicy.cancellationWindow} of placing the order.
                </p>
              ) : (
                <p style={{ margin: 0 }}><strong>Cancellations:</strong> Not accepted once order is placed.</p>
              )}
            </div>
          </div>
        )}

        <Button type="submit" form="checkout-form" variant="primary" size="lg" fullWidth disabled={isProcessing} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {isProcessing ? 'Processing...' : (<><Lock size={18} /> {showPaymentSection ? `Pay ₹${total.toFixed(2)}` : 'Provide Payment'}</>)}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
