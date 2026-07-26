import React, { forwardRef } from 'react';
import '@/styles/css/components/Input.css';

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  fullWidth = true,
  ...props 
}, ref) => {
  const containerClasses = `input-container ${fullWidth ? 'input-full' : ''} ${className}`;
  
  return (
    <div className={containerClasses}>
      {label && <label className="input-label">{label}</label>}
      <input 
        ref={ref}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props} 
      />
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'text-error' : 'text-muted'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
