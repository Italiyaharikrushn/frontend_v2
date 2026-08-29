import React from 'react';
import './States.css';

const EmptyState = ({ title = 'No Data Found', message = 'There is currently no data to display.', actionText, onAction, icon: Icon }) => {
  return (
    <div className="state-container empty-state">
      {Icon && <div className="state-icon empty-icon"><Icon size={48} /></div>}
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary state-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
