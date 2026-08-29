import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@/styles/components/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        onClick={() => onPageChange(i)}
      >
        {i + 1}
      </button>
    );
  }

  return (
    <div className="pagination-container">
      <button
        className="pagination-arrow"
        onClick={handlePrev}
        disabled={currentPage === 0}
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="pagination-numbers">
        {pages}
      </div>

      <button
        className="pagination-arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
