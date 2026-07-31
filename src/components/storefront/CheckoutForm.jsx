import React from 'react';
import { CreditCard, Wallet, User, MapPin } from 'lucide-react';
import PhoneInput from '../ui/PhoneInput';

const CheckoutForm = ({
  handleSubmit,
  phone,
  setPhone,
  isLoadingAddresses,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="checkout-form-section">
      <form id="checkout-form" onSubmit={handleSubmit}>
        {selectedAddressId === 'new' && (
          <div className="form-card glass-panel hover-lift fade-in" style={{ marginBottom: '1rem' }}>
            <h2 className="form-card-title"><User size={20} /> Contact Information</h2>
            <div className="form-grid full">
              <div className="input-group">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" required placeholder="Enter your email" />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <PhoneInput 
                  id="phone" 
                  name="phone"
                  value={phone} 
                  onChange={setPhone} 
                  required 
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-card glass-panel hover-lift" style={{ marginBottom: '1rem' }}>
          <h2 className="form-card-title"><MapPin size={20} /> Shipping Address</h2>
          
          {!isLoadingAddresses && addresses.length > 0 && (
            <div className="address-selector" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {addresses.map(addr => (
                <label key={addr.id} className={`payment-method-card ${selectedAddressId === addr.id ? 'active' : ''}`} style={{ justifyContent: 'flex-start', textAlign: 'left', cursor: 'pointer', height: 'auto', padding: '1rem', alignItems: 'flex-start' }}>
                  <input 
                    type="radio" 
                    name="addressSelection" 
                    value={addr.id} 
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    style={{ marginRight: '1rem', marginTop: '0.25rem' }}
                  />
                  <div style={{ lineHeight: '1.4' }}>
                    <strong>{addr.fullName}</strong><br />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {addr.streetAddress}, {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country} • {addr.phoneNumber}
                    </span>
                  </div>
                </label>
              ))}
              
              {addresses.length < 5 && (
                <label className={`payment-method-card ${selectedAddressId === 'new' ? 'active' : ''}`} style={{ justifyContent: 'flex-start', cursor: 'pointer', padding: '1rem' }}>
                  <input 
                    type="radio" 
                    name="addressSelection" 
                    value="new"
                    checked={selectedAddressId === 'new'}
                    onChange={() => setSelectedAddressId('new')}
                    style={{ marginRight: '1rem' }}
                  />
                  <strong>Add a New Address</strong>
                </label>
              )}
              {addresses.length >= 5 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  You have reached the maximum limit of 5 saved addresses. Please select one of the existing addresses.
                </p>
              )}
            </div>
          )}

          {selectedAddressId === 'new' && (
            <div className="form-grid fade-in">
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
          )}
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
  );
};

export default CheckoutForm;
