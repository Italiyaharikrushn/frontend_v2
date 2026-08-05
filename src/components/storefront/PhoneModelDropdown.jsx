import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { PHONE_SERIES } from '../../utils/phoneModels';
import '@/styles/pages/storefront/PhoneModelDropdown.css';

const PhoneModelDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSeries = useMemo(() => {
    if (!searchTerm.trim()) return PHONE_SERIES;

    const lowerSearch = searchTerm.toLowerCase();
    return PHONE_SERIES.map(series => {
      const filteredModels = series.models.filter(model => 
        model.toLowerCase().includes(lowerSearch)
      );
      return { ...series, models: filteredModels };
    }).filter(series => series.models.length > 0 || series.name.toLowerCase().includes(lowerSearch));
  }, [searchTerm]);

  const handleSelect = (model) => {
    onChange(model);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  return (
    <div className="phone-model-dropdown-container" ref={dropdownRef}>
      <div 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
      >
        <span className={value ? 'selected-value' : 'placeholder'}>
          {value || 'Select a phone model'}
        </span>
        <ChevronDown className="trigger-icon" size={20} />
      </div>

      {isOpen && (
        <div className="dropdown-menu fade-in">
          <div className="dropdown-search-wrapper">
            <Search className="search-icon" size={16} />
            <input
              ref={inputRef}
              type="text"
              className="dropdown-search-input"
              placeholder="Search phone model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={(e) => { e.stopPropagation(); setSearchTerm(''); inputRef.current?.focus(); }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="dropdown-options">
            {filteredSeries.map((series, index) => (
              <div key={index} className="optgroup">
                <div className="optgroup-label">{series.name}</div>
                {series.models.map(model => (
                  <div 
                    key={model}
                    className={`option ${value === model ? 'selected' : ''}`}
                    onClick={() => handleSelect(model)}
                  >
                    {model}
                  </div>
                ))}
              </div>
            ))}
            
            {searchTerm.trim().length >= 3 && /[a-zA-Z]/.test(searchTerm) && (
              <div className="optgroup custom-model-group">
                <div className="optgroup-label">Custom Model</div>
                <div 
                  className="option"
                  onClick={() => handleSelect(searchTerm.trim())}
                >
                  Use "{searchTerm.trim()}"
                </div>
              </div>
            )}

            {searchTerm.trim() && !(searchTerm.trim().length >= 3 && /[a-zA-Z]/.test(searchTerm)) && filteredSeries.length === 0 && (
               <div className="no-results">Please enter a valid phone model (at least 3 chars and contain letters)</div>
            )}

            {filteredSeries.length === 0 && !searchTerm.trim() && (
              <div className="no-results">No phone models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneModelDropdown;
