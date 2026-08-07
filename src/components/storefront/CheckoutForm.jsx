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
  setPaymentMethod,
  showPaymentSection
}) => {
  return (
    <div className="checkout-form-section">
      <form id="checkout-form" onSubmit={handleSubmit}>
        {selectedAddressId === 'new' && (
          <div className="form-card glass-panel hover-lift fade-in" style={{ marginBottom: '1rem' }}>
            <h2 className="form-card-title"><User size={20} /> Contact Information</h2>
            <div className="form-grid full">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" required />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
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
                <label htmlFor="zip">ZIP / Postal Code</label>
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

        {showPaymentSection && (
          <div id="payment-method-section" className="form-card glass-panel hover-lift fade-in">
            <h2 className="form-card-title"><CreditCard size={20} /> Payment Method</h2>
            <div className="payment-methods">
              <button type="button" className={`payment-method-card ${paymentMethod === 'gpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('gpay')}>
                <Wallet size={18} />
                <span>GPay</span>
              </button>
              <button type="button" className={`payment-method-card ${paymentMethod === 'paytm' ? 'active' : ''}`} onClick={() => setPaymentMethod('paytm')}>
                <Wallet size={18} />
                <span>Paytm</span>
              </button>
              <button type="button" className={`payment-method-card ${paymentMethod === 'phonepe' ? 'active' : ''}`} onClick={() => setPaymentMethod('phonepe')}>
                <Wallet size={18} />
                <span>PhonePe</span>
              </button>
            </div>

            {(paymentMethod === 'gpay' || paymentMethod === 'paytm' || paymentMethod === 'phonepe') && (
              <div className="form-grid full fade-in">
                <p style={{ color: 'var(--text-muted)' }}>You will be securely redirected to {paymentMethod === 'gpay' ? 'Google Pay' : paymentMethod === 'paytm' ? 'Paytm' : 'PhonePe'} to complete your purchase.</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
