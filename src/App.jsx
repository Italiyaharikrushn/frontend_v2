import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertProvider } from './components/common/AlertProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import useCartSync from './hooks/useCartSync';

function App() {
  useCartSync();
  return (
    <ErrorBoundary>
      <AlertProvider>
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AlertProvider>
    </ErrorBoundary>
  );
}

export default App;
