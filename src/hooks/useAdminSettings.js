import { useState, useEffect } from 'react';
import { useGetStoreSettingsQuery, useUpdateStoreSettingsMutation } from '../api/settingsApi';
import { useChangePasswordMutation } from '../api/authApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminSettings = () => {
  const { pushToast } = useToast();
  const { data: settingsData, isLoading } = useGetStoreSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateStoreSettingsMutation();
  
  const [formData, setFormData] = useState({
    storeName: 'crafty_kiya',
    supportEmail: 'support@kiyaaccessories.com',
    contactNo: '+91 9876543210',
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
      const payload = {
        ...formData,
        contactNo: formData.contactNo.replace(/\s+/g, '')
      };
      await updateSettings(payload).unwrap();
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

  return {
    formData,
    setFormData,
    passwordData,
    setPasswordData,
    handleSave,
    handlePasswordChange,
    isLoading,
    isUpdating,
    isChangingPassword
  };
};
