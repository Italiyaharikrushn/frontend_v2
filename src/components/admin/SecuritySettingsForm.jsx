import React from 'react';
import { Shield } from 'lucide-react';
import Button from '../ui/Button';

const SecuritySettingsForm = ({ passwordData, setPasswordData, handlePasswordChange, isChangingPassword }) => {
  return (
    <div className="glass-panel admin-panel-card">
      <h2 style={{ marginBottom: '0.75rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={20} /> Security
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Manage your account security and password.</p>

      <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div className="admin-form-field">
          <label>Current Password</label>
          <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>New Password</label>
          <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
        </div>
        <div className="admin-form-field">
          <label>Confirm New Password</label>
          <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
        </div>

        <Button type="submit" variant="secondary" fullWidth disabled={isChangingPassword} style={{ marginTop: '0.25rem' }}>
          {isChangingPassword ? 'Updating...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
};

export default SecuritySettingsForm;
