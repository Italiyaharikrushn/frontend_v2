import React from 'react';
import Button from '../../components/ui/Button';
import { Lock, User, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { getPasswordRulesCol1, getPasswordRulesCol2 } from '../../utils/validationRules';

import '@/styles/pages/admin/AdminStyles.css'; // Reusing admin styles for settings panels
import '@/styles/pages/storefront/AccountSettings.css';

const AccountSettings = () => {
    const {
        userName,
        userEmail,
        passwordData,
        setPasswordData,
        handlePasswordChange,
        isUpdating,
        showPasswords,
        togglePassword
    } = useAccountSettings();

    const passwordRulesCol1 = getPasswordRulesCol1(passwordData.newPassword || '');
    const passwordRulesCol2 = getPasswordRulesCol2(passwordData.newPassword || '');

    return (
        <div className="storefront-container account-settings-container">
            <h1 className="account-settings-title">
                <User size={28} /> Account Settings
            </h1>

            <div className="glass-panel account-settings-panel">
                <h2 className="account-settings-panel-title">Profile Information</h2>
                <div className="account-settings-info-grid">
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

            <div className="glass-panel account-settings-panel">
                <h2 className="account-settings-panel-title">
                    <Lock size={20} /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="account-settings-form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <div className="account-settings-password-wrapper">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                className="form-input account-settings-password-input"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('current')}
                                className="account-settings-password-toggle"
                            >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="account-settings-password-wrapper">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                className="form-input account-settings-password-input"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('new')}
                                className="account-settings-password-toggle"
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {passwordData.newPassword && (
                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password Requirements:</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem' }}>
                                    {[...passwordRulesCol1, ...passwordRulesCol2].map((rule, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                                            {rule.met ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#94a3b8" />}
                                            <span style={{ color: rule.met ? '#16a34a' : 'var(--text-muted)' }}>{rule.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="account-settings-password-wrapper">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                className="form-input account-settings-password-input"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('confirm')}
                                className="account-settings-password-toggle"
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
