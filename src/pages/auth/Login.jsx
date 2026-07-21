import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Lock, User, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { login } from '../../redux/authSlice';
import { useLoginMutation } from '../../api/authApi';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginApi, { isLoading }] = useLoginMutation();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await loginApi({ email, password }).unwrap();
      
      // Response format: { message: "Login success", token: "...", role: "ROLE_..." }
      let userRole = 'CUSTOMER';
      if (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') {
        userRole = 'ADMIN';
      }

      dispatch(login({ role: userRole, token: response.token }));
      
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <div className="glass-panel hover-lift" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', marginBottom: '1rem' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Sign in to continue to {storeSettings?.storeName || 'Kiya Accessories'}</p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} 
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} 
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
