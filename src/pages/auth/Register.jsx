import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, Phone, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import PhoneInput from '../../components/common/PhoneInput';
import { useRegister } from '../../hooks/useRegister';
import { getPasswordRulesCol1, getPasswordRulesCol2 } from '../../utils/validationRules';
import '@/styles/pages/auth/Login.css';

const Register = () => {
  const { formData, setFormData, showPassword, setShowPassword, error, success, isLoading, storeSettings, handleChange, handleRegister } = useRegister();

  const passwordRulesCol1 = getPasswordRulesCol1(formData.password);
  const passwordRulesCol2 = getPasswordRulesCol2(formData.password);

  return (
    <div className="login-page fade-in">
      <div className="auth-card glass-panel hover-lift">
        <div className="auth-card-header">
          <div className="auth-icon">
            <UserPlus size={32} />
          </div>
          <h1>Create an Account</h1>
          <p>Join {storeSettings?.settings?.storeSettings?.storeName} today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label htmlFor="name"><User size={16} /> Full Name</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          </div>

          <div className="input-group">
            <label htmlFor="email"><Mail size={16} /> Email Address</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className="input-group">
            <label htmlFor="password"><Lock size={16} /> Password</label>
            <div className="password-input-wrapper">
              <input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="password-requirements">
                <div className="password-requirements-title">Password Requirements:</div>
                <div className="password-requirements-grid">
                  <div className="password-requirements-col">
                    {passwordRulesCol1.map((rule, index) => (
                      <div key={index} className="password-requirement-item">
                        {rule.met ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#94a3b8" />}
                        <span style={{ color: rule.met ? '#16a34a' : 'var(--text-muted)' }}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="password-requirements-col">
                    {passwordRulesCol2.map((rule, index) => (
                      <div key={index} className="password-requirement-item">
                        {rule.met ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#94a3b8" />}
                        <span style={{ color: rule.met ? '#16a34a' : 'var(--text-muted)' }}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="phone"><Phone size={16} /> Phone Number</label>
            <PhoneInput
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={(val) => setFormData({ ...formData, phone: val })}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: '0.75rem' }}>
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
