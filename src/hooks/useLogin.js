import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectIsAuthenticated, selectUserRole } from '../redux/authSlice';
import { useLoginMutation } from '../api/authApi';
import { useGetPublicStoreSettingsQuery } from '../api/settingsApi';
import { useToast } from '../components/ui/ToastProvider';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (isAuthenticated) {
      const defaultPath = userRole === 'ADMIN' ? '/admin/dashboard' : '/';
      const from = location.state?.from || defaultPath;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, userRole, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await loginApi({ email, password }).unwrap();
      let role = 'CUSTOMER';
      if (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') {
        role = 'ADMIN';
      }

      dispatch(login({
        role: role,
        token: response.token,
        name: response.name || response.customerName || null,
        email: response.email || email
      }));
      pushToast('Welcome back! You are now signed in.', 'success');

      if (role === 'ADMIN') {
        const defaultPath = '/admin/dashboard';
        const from = location.state?.from || defaultPath;
        navigate(from, { replace: true });
      } else {
        const defaultPath = '/';
        const from = location.state?.from || defaultPath;
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    storeSettings,
    handleLogin
  };
};
