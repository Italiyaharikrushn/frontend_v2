import React from 'react';
import { useToast } from '../../hooks/useToast';

export const ToastProvider = ({ children }) => {
  return <>{children}</>;
};

export { useToast };
