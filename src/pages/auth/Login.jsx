import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import { login, selectIsAuthenticated, selectUserRole } from '../../redux/authSlice';
import { useLoginMutation } from '../../api/authApi';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';
import { useToast } from '../../components/ui/ToastProvider';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginApi, { isLoading }] = useLoginMutation();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  const { pushToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(userRole === 'ADMIN' ? '/admin/dashboard' : '/', { replace: true });
    }
  }, [isAuthenticated, navigate, userRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await loginApi({ email, password }).unwrap();
      let userRole = 'CUSTOMER';
      if (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') {
        userRole = 'ADMIN';
      }

      dispatch(login({ 
        role: userRole, 
        token: response.token,
        name: response.name || response.customerName || null,
        email: response.email || email 
      }));
      pushToast('Welcome back! You are now signed in.', 'success');

      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-page fade-in">
      <div className="auth-card glass-panel hover-lift">
        <div className="auth-card-header">
          <div className="auth-icon">
            <ShieldCheck size={28} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to {storeSettings?.storeName || 'Kiya Accessories'}</p>
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
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%' }} />
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
      </div>
    </div>
  );
};

export default Login;
