import React from 'react';

const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`.trim()} aria-hidden="true">
    <div className="skeleton-media" />
    <div className="skeleton-content">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line medium" />
    </div>
  </div>
);

export default SkeletonCard;
