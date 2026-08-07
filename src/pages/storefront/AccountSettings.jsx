import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAlert } from '../../components/ui/AlertProvider';
import { selectUserName, selectUserEmail } from '../../redux/authSlice';
import { useChangePasswordMutation } from '../../api/authApi';
import Button from '../../components/ui/Button';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import '@/styles/pages/admin/AdminStyles.css'; // Reusing admin styles for settings panels

const AccountSettings = () => {
    const { alert } = useAlert();
    const userName = useSelector(selectUserName);
    const userEmail = useSelector(selectUserEmail);
    const [changePassword, { isLoading: isUpdating }] = useChangePasswordMutation();
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        
        try {
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }).unwrap();
            
            if (response.success) {
                alert("Password changed successfully");
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(response.message || "Failed to change password");
            }
        } catch (error) {
            alert(error.data?.message || "Error updating password");
        }
    };

    return (
        <div className="storefront-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={28} /> Account Settings
            </h1>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)', fontSize: '1.25rem' }}>Profile Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={userName || ''} disabled className="form-input" />
                        <small style={{ color: 'var(--text-muted)' }}>Name cannot be changed currently.</small>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={userEmail || ''} disabled className="form-input" />
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lock size={20} /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPasswords.current ? "text" : "password"} 
                                className="form-input"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                required
                                style={{ paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                            <button 
                                type="button"
                                onClick={() => togglePassword('current')}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPasswords.new ? "text" : "password"} 
                                className="form-input"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                required
                                minLength={6}
                                style={{ paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                            <button 
                                type="button"
                                onClick={() => togglePassword('new')}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPasswords.confirm ? "text" : "password"} 
                                className="form-input"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                required
                                minLength={6}
                                style={{ paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                            <button 
                                type="button"
                                onClick={() => togglePassword('confirm')}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <Button type="submit" variant="primary" disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;
