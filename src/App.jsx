import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './components/ui/ToastProvider';
import { AlertProvider } from './components/ui/AlertProvider';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AlertProvider>
          <AppRoutes />
        </AlertProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
