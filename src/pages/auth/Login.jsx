import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import { useLogin } from '../../hooks/useLogin';
import '@/styles/pages/auth/Login.css';

const Login = () => {
  const { email, setEmail, password, setPassword, showPassword, setShowPassword, error, isLoading, storeSettings, handleLogin } = useLogin();

  return (
    <div className="login-page fade-in">
      <div className="auth-card glass-panel hover-lift">
        <div className="auth-card-header">
          <div className="auth-icon">
            <ShieldCheck size={28} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to {storeSettings?.settings?.storeSettings?.storeName}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email"><User size={16} /> Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="input-group">
            <label htmlFor="password"><Lock size={16} /> Password</label>
            <div className="password-input-wrapper">
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="auth-footer auth-footer-bottom">
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
