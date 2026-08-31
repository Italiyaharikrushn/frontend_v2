import React from 'react';
import { MapPin, X } from 'lucide-react';
import Button from '../common/Button';
import PhoneInput from '../common/PhoneInput';

const AddressForm = ({ formData, setFormData, onSubmit, onCancel, isSaving, type }) => {
  return (
    <div className="address-modal-backdrop" onClick={onCancel}>
      <div className="address-modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <h2 className="address-modal-title">
            <MapPin size={20} className="text-primary" />
            {formData.id ? `Edit ${type} Address` : `Add New ${type} Address`}
          </h2>
          <button className="address-modal-close" onClick={onCancel} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="address-modal-body">
          <div className="address-form-grid">
            <div className="input-group full-width">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Recipient's full name"
              />
            </div>

            <div className="input-group full-width">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
                required
              />
            </div>

            <div className="input-group full-width">
              <label htmlFor="streetAddress">Street Address / House No. *</label>
              <input
                type="text"
                id="streetAddress"
                required
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                placeholder="e.g. 124 Park View Lane, Apt 4B"
              />
            </div>

            <div className="input-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>

            <div className="input-group">
              <label htmlFor="state">State / Province *</label>
              <input
                type="text"
                id="state"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
              />
            </div>

            <div className="input-group">
              <label htmlFor="postalCode">Postal / ZIP Code *</label>
              <input
                type="text"
                id="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Postal Code"
              />
            </div>

            <div className="input-group">
              <label htmlFor="country">Country *</label>
              <select
                id="country"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            
            <div className="full-width" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem'}}>
        <input 
          type="checkbox" 
          id="isDefault" 
          checked={formData.isDefault || false}
          onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
          style={{ width: 'auto', minHeight: 'auto', height: '18px', width: '18px', cursor: 'pointer' }}
        />
        <label htmlFor="isDefault" style={{marginBottom: 0, cursor: 'pointer', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.95rem'}}>
          Set as default {type.toLowerCase()} address
        </label>
      </div>      </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : formData.id ? 'Save Changes' : 'Save Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
