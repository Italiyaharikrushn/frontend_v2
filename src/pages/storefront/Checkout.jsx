import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, CreditCard, Wallet, Lock, User, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import { selectCartItems, clearCart } from '../../redux/cartSlice';
import { useAddAddressMutation, useAddToBackendCartMutation, useCheckoutOrderMutation, useClearBackendCartMutation } from '../../api/orderApi';
import { useToast } from '../../components/ui/ToastProvider';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const { pushToast } = useToast();

  const [addAddress] = useAddAddressMutation();
  const [addToBackendCart] = useAddToBackendCartMutation();
  const [clearBackendCart] = useClearBackendCartMutation();
  const [checkoutOrder] = useCheckoutOrderMutation();

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page fade-in" style={{ textAlign: 'center', paddingTop: '10vh' }}>
        <h2>Your cart is empty</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>You need items in your cart to checkout.</p>
        <Button onClick={() => navigate('/products')} variant="primary">Return to Shop</Button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 15.00;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const addressPayload = {
        fullName: `${e.target.firstName.value} ${e.target.lastName.value}`,
        streetAddress: e.target.address.value,
        city: e.target.city.value,
        state: e.target.state.value,
        postalCode: e.target.zip.value,
        country: e.target.country.value,
        phoneNumber: e.target.phone.value,
      };

      const savedAddress = await addAddress(addressPayload).unwrap();
      if (!savedAddress || !savedAddress.id) {
        throw new Error('Failed to save address properly.');
      }

      await clearBackendCart().unwrap();
      for (const item of cartItems) {
        await addToBackendCart({ productId: item.id, quantity: item.quantity }).unwrap();
      }

      await checkoutOrder(savedAddress.id).unwrap();

      setIsProcessing(false);
      dispatch(clearCart());
      pushToast('Order placed successfully. Thank you for shopping with us.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      pushToast('Checkout failed. Please try again or check your connection.', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page fade-in">
      <div className="checkout-header">
        <h1 className="checkout-title">Secure Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="form-card glass-panel hover-lift" style={{ marginBottom: '1rem' }}>
              <h2 className="form-card-title"><User size={20} /> Contact Information</h2>
              <div className="form-grid full">
                <div className="input-group">
                  <label htmlFor="email">Email address</label>
                  <input type="email" id="email" required placeholder="Enter your email" />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" required placeholder="e.g. +1 123 456 7890" />
                </div>
              </div>
            </div>

            <div className="form-card glass-panel hover-lift" style={{ marginBottom: '1rem' }}>
              <h2 className="form-card-title"><MapPin size={20} /> Shipping Address</h2>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="firstName">First name</label>
                  <input type="text" id="firstName" required />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last name</label>
                  <input type="text" id="lastName" required />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="address">Street Address</label>
                  <input type="text" id="address" required placeholder="Street address or P.O. Box" />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" required />
                </div>
                <div className="input-group">
                  <label htmlFor="state">State / Province</label>
                  <input type="text" id="state" required />
                </div>
                <div className="input-group">
                  <label htmlFor="zip">ZIP / Postal code</label>
                  <input type="text" id="zip" required />
                </div>
                <div className="input-group">
                  <label htmlFor="country">Country</label>
                  <select id="country" required defaultValue="India">
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-card glass-panel hover-lift">
              <h2 className="form-card-title"><CreditCard size={20} /> Payment Method</h2>
              <div className="payment-methods">
                <button type="button" className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                  <Wallet size={18} />
                  <span>Cash on Delivery</span>
                </button>
                <button type="button" className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                  <CreditCard size={18} />
                  <span>Credit Card</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="form-grid fade-in">
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="cardNumber">Card number (Demo - leave blank)</label>
                    <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="expDate">Expiration date</label>
                    <input type="text" id="expDate" placeholder="MM/YY" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="cvc">CVC</label>
                    <input type="text" id="cvc" placeholder="123" />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="form-grid full fade-in">
                  <p style={{ color: 'var(--text-muted)' }}>You will pay for your order upon delivery. No payment details required.</p>
                </div>
              )}
            </div>
          </form>
        </div>

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
                    <span className="summary-item-name">{item.name}</span>
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
      </div>
    </div>
  );
};

export default Checkout;
