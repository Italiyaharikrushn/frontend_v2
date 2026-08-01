import React, { createContext, useContext, useState, useCallback } from 'react';
import Button from './Button';

const AlertContext = createContext(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    resolve: null,
    isConfirm: false
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        resolve,
        isConfirm: true
      });
    });
  }, []);

  const alert = useCallback((message) => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        resolve,
        isConfirm: false,
        isPrompt: false
      });
    });
  }, []);

  const prompt = useCallback((message, defaultValue = '') => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        resolve,
        isConfirm: false,
        isPrompt: true,
        promptValue: defaultValue
      });
    });
  }, []);

  const handleClose = (result) => {
    if (alertState.resolve) {
      alertState.resolve(result);
    }
    setAlertState({ isOpen: false, message: '', resolve: null, isConfirm: false });
  };

  return (
    <AlertContext.Provider value={{ confirm, alert, prompt }}>
      {children}
      {alertState.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(31, 26, 23, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div className="glass-panel fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', fontSize: '1.25rem', fontWeight: '600' }}>
              {alertState.isPrompt ? 'Input Required' : alertState.isConfirm ? 'Confirm Action' : 'Alert'}
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>{alertState.message}</p>
            {alertState.isPrompt && (
              <input 
                type="text" 
                value={alertState.promptValue} 
                onChange={(e) => setAlertState(prev => ({ ...prev, promptValue: e.target.value }))}
                style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-input)' }}
                autoFocus
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              {(alertState.isConfirm || alertState.isPrompt) && (
                <Button variant="secondary" onClick={() => handleClose(null)}>Cancel</Button>
              )}
              <Button variant="primary" onClick={() => handleClose(alertState.isPrompt ? alertState.promptValue : true)}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
