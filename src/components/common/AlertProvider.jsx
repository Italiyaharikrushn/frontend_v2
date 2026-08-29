import React, { createContext, useContext, useState, useCallback } from 'react';
import Button from './Button';
import { Download, Upload } from 'lucide-react';

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

  const bulkUploadPrompt = useCallback((message) => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        resolve,
        isConfirm: false,
        isPrompt: false,
        isBulkUpload: true,
        bulkFile: null
      });
    });
  }, []);

  const handleClose = (result) => {
    if (alertState.resolve) {
      alertState.resolve(result);
    }
    setAlertState({ isOpen: false, message: '', resolve: null, isConfirm: false, isPrompt: false, isBulkUpload: false });
  };

  return (
    <AlertContext.Provider value={{ confirm, alert, prompt, bulkUploadPrompt }}>
      {children}
      {alertState.isOpen && (
        <div 
          onClick={() => handleClose(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(31, 26, 23, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="glass-panel fade-in" 
            style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', maxWidth: '400px', width: '100%', textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', fontSize: '1.25rem', fontWeight: '600' }}>
              {alertState.isBulkUpload ? 'Bulk Upload' : alertState.isPrompt ? 'Input Required' : alertState.isConfirm ? 'Confirm Action' : 'Alert'}
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
            {alertState.isBulkUpload && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem', alignItems: 'center', width: '100%' }}>
                <a 
                  href={`${import.meta.env.VITE_BASE_URL || 'http://localhost:8081'}/product/bulk-upload-sample`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="download-sample-btn"
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    color: 'var(--primary)', backgroundColor: 'rgba(var(--primary-rgb), 0.1)', 
                    padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', 
                    textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600',
                    transition: 'all 0.2s ease', border: '1px solid rgba(var(--primary-rgb), 0.2)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--primary-rgb), 0.1)'; }}
                >
                  <Download size={18} /> Download Sample Format
                </a>
                
                <div style={{ 
                  width: '100%', padding: '1.5rem', border: '2px dashed var(--border)', 
                  borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-hover)',
                  position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--surface)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--surface-hover)'; }}
                >
                  <Upload size={24} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500' }}>
                    {alertState.bulkFile ? alertState.bulkFile.name : 'Click to select CSV/Excel file'}
                  </span>
                  <input 
                    type="file" 
                    accept=".csv, .xlsx, .xls"
                    onChange={(e) => setAlertState(prev => ({ ...prev, bulkFile: e.target.files[0] }))}
                    style={{ 
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                      opacity: 0, cursor: 'pointer' 
                    }}
                  />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              {(alertState.isConfirm || alertState.isPrompt || alertState.isBulkUpload) && (
                <Button variant="secondary" onClick={() => handleClose(null)}>Cancel</Button>
              )}
              <Button variant="primary" onClick={() => handleClose(alertState.isBulkUpload ? alertState.bulkFile : alertState.isPrompt ? alertState.promptValue : true)}>
                {alertState.isBulkUpload ? 'Upload' : 'OK'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
