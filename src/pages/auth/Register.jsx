import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import PhoneInput from '../../components/ui/PhoneInput';
import { useRegister } from '../../hooks/useRegister';
import '@/styles/pages/auth/Login.css';

const Register = () => {
  const { formData, setFormData, showPassword, setShowPassword, error, success, isLoading, storeSettings, handleChange, handleRegister } = useRegister();

  return (
    <div className="login-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-main)', padding: '2rem' }}>
      <div className="glass-panel hover-lift" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', marginBottom: '1rem' }}>
            <UserPlus size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Join {storeSettings?.storeName || 'Kiya Accessories'} today</p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce3', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required style={{ width: '100%', padding: '0.875rem', paddingRight: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> Phone Number</label>
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

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
