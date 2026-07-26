import React, { useState, useEffect } from 'react';
import { Save, Store, Bell, Shield, Phone, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetStoreSettingsQuery, useUpdateStoreSettingsMutation } from '../../api/settingsApi';
import { useChangePasswordMutation } from '../../api/authApi';
import { useToast } from '../../components/ui/ToastProvider';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminSettings = () => {
  const { pushToast } = useToast();
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
      pushToast('Store settings updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update settings:', err);
      pushToast('Failed to update store settings.', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      pushToast("New passwords don't match!", 'error');
      return;
    }
    
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      
      if (response.success) {
        pushToast('Password updated successfully!', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        pushToast(response.message || 'Failed to update password.', 'error');
      }
    } catch (err) {
      console.error(err);
      if (err.data && err.data.message) {
        pushToast(err.data.message, 'error');
      } else {
        pushToast('An error occurred while updating password.', 'error');
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel admin-panel-card">
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Store size={20} /> Store Profile
            </h2>

            <div className="admin-form-grid">
              <div className="admin-form-field full">
                <label>Store Name</label>
                <input type="text" value={formData.storeName} onChange={(e) => setFormData({...formData, storeName: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>Support Email</label>
                <input type="email" value={formData.supportEmail} onChange={(e) => setFormData({...formData, supportEmail: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>Contact Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}>
                  <Phone size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input type="text" placeholder="000000000" value={formData.contactNo} onChange={(e) => setFormData({...formData, contactNo: e.target.value})} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'inherit', fontFamily: 'inherit', fontSize: '1rem' }} />
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Location Details
            </h3>
            <div className="admin-form-grid">
              <div className="admin-form-field full">
                <label>Street Address</label>
                <textarea rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>State</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>Pincode</label>
                <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="glass-panel admin-panel-card">
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} /> Notifications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6 }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel admin-panel-card">
            <h2 style={{ marginBottom: '0.75rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} /> Security
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Manage your account security and password.</p>

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div className="admin-form-field">
                <label>Current Password</label>
                <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>New Password</label>
                <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
              </div>
              <div className="admin-form-field">
                <label>Confirm New Password</label>
                <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
              </div>

              <Button type="submit" variant="secondary" fullWidth disabled={isChangingPassword} style={{ marginTop: '0.25rem' }}>
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
