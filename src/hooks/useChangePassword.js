import { useState } from 'react';
import { useChangePasswordMutation } from '../api/authApi';
import { useToast } from '../components/common/ToastProvider';
import { isPasswordValid } from '../utils/validationRules';

export const useChangePassword = () => {
  const { pushToast } = useToast();
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!isPasswordValid(passwordData.newPassword)) {
      pushToast('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.', 'error');
      return;
    }
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

  return { passwordData, setPasswordData, handlePasswordChange, isChangingPassword };
};
