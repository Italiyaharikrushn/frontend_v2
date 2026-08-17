import React, { useRef } from 'react';
import { Store, MapPin, Camera, Loader } from 'lucide-react';
import PhoneInput from '../ui/PhoneInput';
import { useUploadImageMutation } from '../../api/settingsApi';
import { getMediaUrl } from '../../utils/apiHelpers';

const StoreProfileForm = ({ formData, setFormData }) => {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadImage(file).unwrap();
      if (res.success) {
        setFormData({ ...formData, profilePhoto: res.url });
      }
    } catch (err) {
      console.error("Failed to upload image", err);
    }
  };

  return (
    <div className="glass-panel admin-panel-card">
      <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Store size={20} /> Store Profile
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--primary-main)' }}>
          {formData.profilePhoto ? (
            <img src={getMediaUrl(formData.profilePhoto)} alt="Store Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Store size={40} color="var(--text-muted)" />
          )}
          
          <div 
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader size={16} color="#fff" className="spin" /> : <Camera size={16} color="#fff" />}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
        </div>
      </div>

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
        <div className="admin-form-field full">
          <label>Store Timings</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
            <select value={formData.timingDays} onChange={(e) => setFormData({ ...formData, timingDays: e.target.value })} style={{ flex: 1, minWidth: 0 }}>
              <option value="Mon-Sun">Mon-Sun</option>
              <option value="Mon-Sat">Mon-Sat</option>
              <option value="Mon-Fri">Mon-Fri</option>
              <option value="Tue-Sun">Tue-Sun</option>
              <option value="Weekends">Weekends</option>
            </select>
            <select value={formData.timingOpen} onChange={(e) => setFormData({ ...formData, timingOpen: e.target.value })} style={{ flex: 1, minWidth: 0 }}>
              <option value="06:00 AM">06:00 AM</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
            </select>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>to</span>
            <select value={formData.timingClose} onChange={(e) => setFormData({ ...formData, timingClose: e.target.value })} style={{ flex: 1, minWidth: 0 }}>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
              <option value="07:00 PM">07:00 PM</option>
              <option value="08:00 PM">08:00 PM</option>
              <option value="09:00 PM">09:00 PM</option>
              <option value="10:00 PM">10:00 PM</option>
              <option value="11:00 PM">11:00 PM</option>
              <option value="12:00 AM">12:00 AM</option>
            </select>
          </div>
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
