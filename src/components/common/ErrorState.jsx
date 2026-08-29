import React from 'react';
import './States.css';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ title = 'Something went wrong', message = 'An error occurred while loading this data.', onRetry }) => {
  return (
    <div className="state-container error-state">
      <div className="state-icon error-icon">
        <AlertCircle size={48} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-danger state-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
