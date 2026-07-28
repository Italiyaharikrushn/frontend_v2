import React from 'react';
import { Save, Bell } from 'lucide-react';
import Button from '../../components/ui/Button';
import StoreProfileForm from '../../components/admin/StoreProfileForm';
import SecuritySettingsForm from '../../components/admin/SecuritySettingsForm';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminSettings = () => {
  const { formData, setFormData, passwordData, setPasswordData, handleSave, handlePasswordChange, isLoading, isUpdating, isChangingPassword } = useAdminSettings();

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
          <StoreProfileForm formData={formData} setFormData={setFormData} />

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
          <SecuritySettingsForm
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            handlePasswordChange={handlePasswordChange}
            isChangingPassword={isChangingPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
