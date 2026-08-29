import React from 'react';
import './States.css';

const LoadingState = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div className={`state-container loading-state ${fullScreen ? 'full-screen' : ''}`}>
      <div className="spinner"></div>
      <p className="state-message">{message}</p>
    </div>
  );
};

export default LoadingState;
