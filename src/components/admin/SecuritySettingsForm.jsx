import React from 'react';
import { Shield } from 'lucide-react';
import Button from '../common/Button';

const SecuritySettingsForm = ({ passwordData, setPasswordData, handlePasswordChange, isChangingPassword }) => {
  return (
    <div className="glass-panel admin-panel-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', color: 'white', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(var(--primary-rgb, 99, 102, 241), 0.25)' }}>
        <Shield size={28} />
      </div>
      <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '600' }}>
        Security Settings
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>Ensure your account is using a long, secure password to keep your data safe.</p>

      <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div className="admin-form-field">
          <label style={{ fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Current Password</label>
          <input type="password" placeholder='Current Password' required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', transition: 'all 0.2s ease', outline: 'none' }} />
        </div>
        <div className="admin-form-field">
          <label style={{ fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>New Password</label>
          <input type="password" placeholder='New Password' required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', transition: 'all 0.2s ease', outline: 'none' }} />
        </div>
        <div className="admin-form-field">
          <label style={{ fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Confirm New Password</label>
          <input type="password" placeholder='Confirm New Password' required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', transition: 'all 0.2s ease', outline: 'none' }} />
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isChangingPassword} style={{ marginTop: '1rem', padding: '0.8rem', fontSize: '1rem', fontWeight: '600', borderRadius: 'var(--radius-md)' }}>
          {isChangingPassword ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default SecuritySettingsForm;
