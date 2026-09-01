import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserName, selectUserEmail } from '../redux/authSlice';
import { useChangePassword } from './useChangePassword';

export const useAccountSettings = () => {
    const userName = useSelector(selectUserName);
    const userEmail = useSelector(selectUserEmail);

    const { passwordData, setPasswordData, handlePasswordChange, isChangingPassword } = useChangePassword();

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return {
        userName,
        userEmail,
        passwordData,
        setPasswordData,
        handlePasswordChange,
        isUpdating: isChangingPassword,
        showPasswords,
        togglePassword
    };
};
