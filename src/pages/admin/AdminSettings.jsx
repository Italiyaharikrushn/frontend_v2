import React, { useState, useEffect } from 'react';
import { Save, Store, Bell, Shield, Phone, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetStoreSettingsQuery, useUpdateStoreSettingsMutation } from '../../api/settingsApi';
import { useChangePasswordMutation } from '../../api/authApi';
import './AdminStyles.css';

const AdminSettings = () => {
  const { data: settingsData, isLoading } = useGetStoreSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateStoreSettingsMutation();
  
  const [formData, setFormData] = useState({
    storeName: 'KIYA Accessories',
    supportEmail: 'support@kiyaaccessories.com',
    contactNo: '+91 0000000000',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (settingsData) {
      setFormData({
        storeName: settingsData.storeName || '',
        supportEmail: settingsData.supportEmail || '',
        contactNo: settingsData.contactNo || '',
        address: settingsData.address || '',
        city: settingsData.city || '',
        state: settingsData.state || '',
        pincode: settingsData.pincode || ''
      });
    }
  }, [settingsData]);

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
      alert('Store settings updated successfully!');
    } catch (err) {
      console.error('Failed to update settings:', err);
      alert('Failed to update store settings.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      
      if (response.success) {
        alert('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(response.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error(err);
      if (err.data && err.data.message) {
        alert(err.data.message);
      } else {
        alert('An error occurred while updating password.');
      }
    }
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Store Settings</h1>
        <div className="admin-actions">
          <Button variant="primary" onClick={handleSave} disabled={isUpdating || isLoading} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Save size={18} /> {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="admin-two-column">
        {/* Main Settings Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Store size={20} /> Store Profile
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Store Name</label>
                <input type="text" value={formData.storeName} onChange={(e) => setFormData({...formData, storeName: e.target.value})} style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Support Email</label>
                <input type="email" value={formData.supportEmail} onChange={(e) => setFormData({...formData, supportEmail: e.target.value})} style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Contact Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}>
                  <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                  <input type="text" value={formData.contactNo} onChange={(e) => setFormData({...formData, contactNo: e.target.value})} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'inherit', fontFamily: 'inherit', fontSize: '1rem' }} />
                </div>
              </div>
            </div>

            {/* Location Section inside Store Profile */}
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Location Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Street Address</label>
                <textarea rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>State</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Pincode</label>
                <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem' }} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} /> Notifications
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'not-allowed', color: 'var(--text-main)' }}>
                <input type="checkbox" defaultChecked disabled />
                <span>Email me when a new order is placed (Coming Soon)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'not-allowed', color: 'var(--text-main)' }}>
                <input type="checkbox" defaultChecked disabled />
                <span>Email me when a product is low on stock (Coming Soon)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'not-allowed', color: 'var(--text-main)' }}>
                <input type="checkbox" disabled />
                <span>Weekly summary reports (Coming Soon)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} /> Security
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Manage your account security and password.</p>
            
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Current Password</label>
                <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>New Password</label>
                <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-main)' }}>Confirm New Password</label>
                <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} />
              </div>
              
              <Button type="submit" variant="secondary" fullWidth disabled={isChangingPassword} style={{ marginTop: '0.5rem' }}>
                {isChangingPassword ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
