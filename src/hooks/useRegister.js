import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectIsAuthenticated, selectUserRole } from '../redux/authSlice';
import { useRegisterMutation } from '../api/authApi';
import { useGetPublicStoreSettingsQuery } from '../api/settingsApi';

export const useRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(userRole === 'ADMIN' ? '/admin/dashboard' : '/', { replace: true });
    }
  }, [isAuthenticated, navigate, userRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await register(formData).unwrap();
      if (response.success) {
        setSuccess('Registration successful! Logging you in...');
        let role = 'CUSTOMER';
        if (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') {
          role = 'ADMIN';
        }

        dispatch(login({ role: role, token: response.token }));

        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
    }
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    error,
    success,
    isLoading,
    storeSettings,
    handleChange,
    handleRegister
  };
};
