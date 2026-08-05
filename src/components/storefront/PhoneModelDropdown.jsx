import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { PHONE_SERIES } from '../../utils/phoneModels';
import '@/styles/pages/storefront/PhoneModelDropdown.css';

const PhoneModelDropdown = ({ value, onChange }) => {
  const [selectedSeries, setSelectedSeries] = useState(() => {
    if (value) {
      const found = PHONE_SERIES.find(s => s.models.includes(value));
      return found ? found.name : '';
    }
    return '';
  });

  const [isSeriesOpen, setIsSeriesOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const seriesRef = useRef(null);
  const modelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      const found = PHONE_SERIES.find(s => s.models.includes(value));
      if (found && found.name !== selectedSeries) {
        setSelectedSeries(found.name);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (seriesRef.current && !seriesRef.current.contains(event.target)) {
        setIsSeriesOpen(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setIsModelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableModels = useMemo(() => {
    if (!selectedSeries) return [];
    const series = PHONE_SERIES.find(s => s.name === selectedSeries);
    if (!series) return [];
    
    if (!searchTerm.trim()) return series.models;
    const lowerSearch = searchTerm.toLowerCase();
    return series.models.filter(model => model.toLowerCase().includes(lowerSearch));
  }, [selectedSeries, searchTerm]);

  const handleSeriesSelect = (seriesName) => {
    setSelectedSeries(seriesName);
    setIsSeriesOpen(false);
    onChange('');
    setSearchTerm('');
  };

  const handleModelSelect = (model) => {
    onChange(model);
    setIsModelOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="phone-model-dropdowns-wrapper">
      <div className="phone-model-dropdown-container" ref={seriesRef}>
        <div 
          className={`dropdown-trigger ${isSeriesOpen ? 'open' : ''}`}
          onClick={() => setIsSeriesOpen(!isSeriesOpen)}
        >
          <span className={selectedSeries ? 'selected-value' : 'placeholder'}>
            {selectedSeries || 'Select Phone Name'}
          </span>
          <ChevronDown className="trigger-icon" size={20} />
        </div>

        {isSeriesOpen && (
          <div className="dropdown-menu fade-in">
            <div className="dropdown-options">
              {PHONE_SERIES.map((series, index) => (
                <div 
                  key={index}
                  className={`option ${selectedSeries === series.name ? 'selected' : ''}`}
                  onClick={() => handleSeriesSelect(series.name)}
                >
                  {series.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`phone-model-dropdown-container ${!selectedSeries ? 'disabled' : ''}`} ref={modelRef}>
        <div 
          className={`dropdown-trigger ${isModelOpen ? 'open' : ''}`}
          onClick={() => {
            if (selectedSeries) {
              setIsModelOpen(!isModelOpen);
              if (!isModelOpen) {
                setTimeout(() => inputRef.current?.focus(), 10);
              }
            }
          }}
        >
          <span className={value ? 'selected-value' : 'placeholder'}>
            {value || 'Select model'}
          </span>
          <ChevronDown className="trigger-icon" size={20} />
        </div>

        {isModelOpen && selectedSeries && (
          <div className="dropdown-menu fade-in">
            <div className="dropdown-search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                ref={inputRef}
                type="text"
                className="dropdown-search-input"
                placeholder="Search model..."
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
              {availableModels.map(model => (
                <div 
                  key={model}
                  className={`option ${value === model ? 'selected' : ''}`}
                  onClick={() => handleModelSelect(model)}
                >
                  {model}
                </div>
              ))}
              
              {searchTerm.trim().length >= 3 && /[a-zA-Z]/.test(searchTerm) && (
                <div className="optgroup custom-model-group">
                  <div className="optgroup-label">Custom Model</div>
                  <div 
                    className="option"
                    onClick={() => handleModelSelect(searchTerm.trim())}
                  >
                    Use "{searchTerm.trim()}"
                  </div>
                </div>
              )}

              {availableModels.length === 0 && !searchTerm.trim() && (
                <div className="no-results">No models found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneModelDropdown;
