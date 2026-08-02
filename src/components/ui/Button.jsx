import React from 'react';
import '@/styles/components/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  isLoading = false,
  ...props 
}) => {
  const classes = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${isLoading ? 'btn-loading' : ''} ${className}`;

  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className="loader"></span> : children}
    </button>
  );
};

export default Button;
