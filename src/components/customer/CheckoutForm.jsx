import { CreditCard, Wallet, User, MapPin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PhoneInput from '../common/PhoneInput';
import { useDeleteShippingAddressMutation, useDeleteBillingAddressMutation } from '../../api/addressApi';
import { useToast } from '../common/ToastProvider';
import { useAlert } from '../common/AlertProvider';

const CheckoutForm = ({
  handleSubmit,
  phone,
  setPhone,
  isLoadingAddresses,
  shippingAddresses,
  billingAddresses,
  selectedAddressId,
  setSelectedAddressId,
  paymentMethod,
  setPaymentMethod,
  showPaymentSection,
  isBillingSameAsShipping,
  setIsBillingSameAsShipping,
  selectedBillingAddressId,
  setSelectedBillingAddressId,
  billingPhone,
  setBillingPhone
}) => {
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const [deleteBillingAddress] = useDeleteBillingAddressMutation();
  const { pushToast } = useToast();
  const { confirm } = useAlert();

  const handleDeleteAddress = async (e, addressId, type) => {
    e.preventDefault();
    e.stopPropagation();
    const shouldDelete = await confirm('Delete this saved address?');
    if (shouldDelete) {
      try {
        if (type === 'shipping') {
          await deleteShippingAddress(addressId).unwrap();
          pushToast('Shipping address deleted', 'success');
          if (selectedAddressId === addressId) {
            const remaining = shippingAddresses.filter(a => a.id !== addressId);
            setSelectedAddressId(remaining.length > 0 ? remaining[0].id : 'new');
          }
        } else {
          await deleteBillingAddress(addressId).unwrap();
          pushToast('Billing address deleted', 'success');
          if (selectedBillingAddressId === addressId) {
            const remaining = billingAddresses.filter(a => a.id !== addressId);
            setSelectedBillingAddressId(remaining.length > 0 ? remaining[0].id : 'new');
          }
        }
      } catch (err) {
        pushToast('Failed to delete address', 'error');
      }
    }
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="form-card-title" style={{ margin: 0 }}><MapPin size={20} /> Shipping Address</h2>
            <Link to="/addresses" style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: '500' }}>
              Manage Addresses
            </Link>
          </div>

          {!isLoadingAddresses && shippingAddresses.length > 0 && (
            <div className="address-selector" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {shippingAddresses.map(addr => (
                <div key={addr.id} className={`payment-method-card ${selectedAddressId === addr.id ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', cursor: 'pointer', height: 'auto', padding: '1rem', alignItems: 'flex-start' }} onClick={() => setSelectedAddressId(addr.id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
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
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteAddress(e, addr.id, 'shipping')}
                    title="Delete address"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {shippingAddresses.length < 5 && (
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
              {shippingAddresses.length >= 5 && (
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
                <input type="text" id="firstName" name="firstName" placeholder=" " required />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder=" " required />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="address">Street Address</label>
                <input type="text" id="address" name="address" required placeholder="Street address or P.O. Box" />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" placeholder=" " required />
              </div>
              <div className="input-group">
                <label htmlFor="state">State / Province</label>
                <input type="text" id="state" name="state" placeholder=" " required />
              </div>
              <div className="input-group">
                <label htmlFor="zip">ZIP / Postal Code</label>
                <input type="text" id="zip" name="zip" placeholder=" " required />
              </div>
              <div className="input-group">
                <label htmlFor="country">Country</label>
                <select id="country" name="country" required defaultValue="India">
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="form-card glass-panel hover-lift" style={{ marginBottom: '1rem' }}>
          <h2 className="form-card-title" style={{ margin: 0, marginBottom: '1rem' }}><MapPin size={20} /> Billing Address</h2>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '1.5rem', gap: '0.5rem', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={isBillingSameAsShipping}
              onChange={(e) => setIsBillingSameAsShipping(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Billing address is same as shipping address
          </label>

          {!isBillingSameAsShipping && (
            <div className="fade-in">
              {!isLoadingAddresses && billingAddresses.length > 0 && (
                <div className="address-selector" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {billingAddresses.map(addr => (
                    <div key={`billing-${addr.id}`} className={`payment-method-card ${selectedBillingAddressId === addr.id ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', cursor: 'pointer', height: 'auto', padding: '1rem', alignItems: 'flex-start' }} onClick={() => setSelectedBillingAddressId(addr.id)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                        <input
                          type="radio"
                          name="billingAddressSelection"
                          value={addr.id}
                          checked={selectedBillingAddressId === addr.id}
                          onChange={() => setSelectedBillingAddressId(addr.id)}
                          style={{ marginRight: '1rem', marginTop: '0.25rem' }}
                        />
                        <div style={{ lineHeight: '1.4' }}>
                          <strong>{addr.fullName}</strong><br />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {addr.streetAddress}, {addr.city}, {addr.state} {addr.postalCode}<br />
                            {addr.country} • {addr.phoneNumber}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteAddress(e, addr.id, 'billing')}
                        title="Delete address"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {billingAddresses.length < 5 && (
                    <label className={`payment-method-card ${selectedBillingAddressId === 'new' ? 'active' : ''}`} style={{ justifyContent: 'flex-start', cursor: 'pointer', padding: '1rem' }}>
                      <input
                        type="radio"
                        name="billingAddressSelection"
                        value="new"
                        checked={selectedBillingAddressId === 'new'}
                        onChange={() => setSelectedBillingAddressId('new')}
                        style={{ marginRight: '1rem' }}
                      />
                      <strong>Add a New Address</strong>
                    </label>
                  )}
                </div>
              )}

              {selectedBillingAddressId === 'new' && (
                <div className="form-grid fade-in">
                  <div className="input-group">
                    <label htmlFor="billingFirstName">First Name</label>
                    <input type="text" id="billingFirstName" name="billingFirstName" placeholder=" " required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="billingLastName">Last Name</label>
                    <input type="text" id="billingLastName" name="billingLastName" placeholder=" " required />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="billingAddress">Street Address</label>
                    <input type="text" id="billingAddress" name="billingAddress" required placeholder="Street address or P.O. Box" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="billingCity">City</label>
                    <input type="text" id="billingCity" name="billingCity" placeholder=" " required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="billingState">State / Province</label>
                    <input type="text" id="billingState" name="billingState" placeholder=" " required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="billingZip">ZIP / Postal Code</label>
                    <input type="text" id="billingZip" name="billingZip" placeholder=" " required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="billingPhone">Phone Number</label>
                    <PhoneInput
                      id="billingPhone"
                      name="billingPhone"
                      value={billingPhone}
                      onChange={setBillingPhone}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="billingCountry">Country</label>
                    <select id="billingCountry" name="billingCountry" required defaultValue="India">
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showPaymentSection && (
          <div id="payment-method-section" className="form-card glass-panel hover-lift fade-in">
            <h2 className="form-card-title"><CreditCard size={20} /> Payment Method</h2>
            <div className="payment-methods">
              <button type="button" className={`payment-method-card ${paymentMethod === 'razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('razorpay')}>
                <CreditCard size={18} />
                <span>Online Payment (Razorpay)</span>
              </button>
            </div>

            {paymentMethod === 'razorpay' && (
              <div className="form-grid full fade-in">
                <p style={{ color: 'var(--text-muted)' }}>You will be securely redirected to Razorpay to complete your purchase.</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
