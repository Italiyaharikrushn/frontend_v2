import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../../redux/authSlice';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If authenticated but wrong role, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
