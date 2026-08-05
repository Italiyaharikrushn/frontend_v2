import React from 'react';
import { Store, MapPin } from 'lucide-react';
import PhoneInput from '../ui/PhoneInput';

const StoreProfileForm = ({ formData, setFormData }) => {
  return (
    <div className="glass-panel admin-panel-card">
      <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Store size={20} /> Store Profile
      </h2>

      <div className="admin-form-grid">
        <div className="admin-form-field full">
          <label>Store Name</label>
          <input type="text" placeholder="crafty_kiya" value={formData.storeName} onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>Support Email</label>
          <input type="email" placeholder="support@kiyaaccessories.com" value={formData.supportEmail} onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>Contact Number</label>
          <PhoneInput 
            id="contactNo"
            name="contactNo"
            value={formData.contactNo} 
            placeholder='83647 21474'
            onChange={(val) => setFormData({ ...formData, contactNo: val })} 
            required 
          />
        </div>
      </div>

      <h3 style={{ marginTop: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={18} /> Location Details
      </h3>
      <div className="admin-form-grid">
        <div className="admin-form-field full">
          <label>Street Address</label>
          <textarea rows="3" value={formData.address} placeholder='123 Main St, Anytown, USA' onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>City</label>
          <input type="text" value={formData.city} placeholder='Anytown' onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>State</label>
          <input type="text" value={formData.state} placeholder='USA' onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>PIN Code</label>
          <input type="text" value={formData.pincode} placeholder='123456' onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
        </div>
      </div>
    </div>
  );
};

export default StoreProfileForm;
