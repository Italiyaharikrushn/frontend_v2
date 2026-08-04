import React from 'react';
import SecuritySettingsForm from '../../components/admin/SecuritySettingsForm';
import { useChangePassword } from '../../hooks/useChangePassword';
import '@/styles/pages/admin/AdminStyles.css';

const AdminChangePassword = () => {
  const { passwordData, setPasswordData, handlePasswordChange, isChangingPassword } = useChangePassword();

  return (
    <div className="admin-page fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4rem', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <SecuritySettingsForm
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          handlePasswordChange={handlePasswordChange}
          isChangingPassword={isChangingPassword}
        />
      </div>
    </div>
  );
};

export default AdminChangePassword;
