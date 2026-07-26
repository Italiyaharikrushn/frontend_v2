import { useSelector, useDispatch } from 'react-redux';
import { login, logout, selectIsAuthenticated, selectUserRole, selectUserName, selectUserEmail } from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);

  const handleLogin = (credentials) => dispatch(login(credentials));
  const handleLogout = () => dispatch(logout());

  return {
    isAuthenticated,
    role,
    name,
    email,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuth;
