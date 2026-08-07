import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAlert } from '../ui/AlertProvider';
import { Tag, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { useGetCategoriesQuery, useGetProductsQuery } from '../../api/productApi';

const MultiSelectDropdown = ({ options, selectedValuesStr, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const selectedValues = selectedValuesStr ? selectedValuesStr.split(',').filter(Boolean) : [];

  const toggleOption = (val) => {
    let newSelected;
    if (selectedValues.includes(val)) {
      newSelected = selectedValues.filter(v => v !== val);
    } else {
      newSelected = [...selectedValues, val];
    }
    onChange(newSelected.join(','));
  };

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={handleToggle}
        style={{
          border: '1px solid var(--border-light)',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          background: 'var(--bg-main)',
          minHeight: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--text-main)',
          transition: 'border-color 0.2s',
          fontSize: '0.95rem'
        }}
        className="multi-select-header"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
        </span>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
      </div>
      
      {isOpen && createPortal(
        <div ref={menuRef} style={{
          position: 'absolute',
          top: `${coords.top + 4}px`,
          left: `${coords.left}px`,
          width: `${coords.width}px`,
          background: 'var(--bg-main, #ffffff)',
          border: '1px solid var(--border-light, #e2e8f0)',
          borderRadius: '0.5rem',
          zIndex: 9999,
          maxHeight: '220px',
          overflowY: 'auto',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          {options.map((opt, idx) => (
            <label key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-light, #e2e8f0)',
              margin: 0,
              color: 'var(--text-main, #1e293b)',
              fontSize: '0.95rem',
              transition: 'background-color 0.2s',
              background: 'var(--bg-main, #ffffff)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-muted, #f1f5f9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main, #ffffff)'}
            >
              <input 
                type="checkbox" 
                checked={selectedValues.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
                style={{ marginRight: '0.75rem', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              {opt.label}
            </label>
          ))}
          {options.length === 0 && <div style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No options available</div>}
        </div>,
        document.body
      )}
    </div>
  );
};

const FestivalSalePanel = ({ formData, setFormData, handleSave, isUpdating }) => {
  const { alert } = useAlert();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: allProductsData } = useGetProductsQuery(); // Fetch all to populate dropdown
  const products = Array.isArray(allProductsData) ? allProductsData : (allProductsData?.content || []);
  
  return (
    <div className="glass-panel admin-panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
        <Tag size={20} /> Festival Sale Configuration
      </h2>
      <div className="admin-form-grid">
        <div className="admin-form-field">
          <label>Sale Name</label>
          <input 
            type="text" 
            value={formData.festivalName} 
            onChange={(e) => setFormData({...formData, festivalName: e.target.value})} 
            placeholder="e.g. Diwali Super Sale" 
          />
        </div>
        <div className="admin-form-field">
          <label>Storewide Discount %</label>
          <input 
            type="number" 
            min="0" max="100" 
            value={formData.festivalDiscountPercentage} 
            onChange={(e) => setFormData({...formData, festivalDiscountPercentage: e.target.value})} 
            placeholder="e.g. 20" 
          />
        </div>
        <div className="admin-form-field">
          <label>Start Date</label>
          <input 
            type="datetime-local" 
            value={formData.festivalStartDate} 
            onChange={(e) => setFormData({...formData, festivalStartDate: e.target.value})} 
          />
        </div>
        <div className="admin-form-field">
          <label>End Date</label>
          <input 
            type="datetime-local" 
            value={formData.festivalEndDate || ''} 
            onChange={(e) => setFormData({...formData, festivalEndDate: e.target.value})} 
          />
        </div>
        <div className="admin-form-field">
          <label>Target Category <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>(Optional)</span></label>
          <MultiSelectDropdown 
            options={categories.map(cat => ({ label: cat, value: cat }))}
            selectedValuesStr={formData.festivalTargetCategory || ''}
            onChange={(val) => setFormData({...formData, festivalTargetCategory: val})}
            placeholder="-- All Categories --"
          />
        </div>
        <div className="admin-form-field">
          <label>Target Product <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>(Optional)</span></label>
          <MultiSelectDropdown 
            options={products.map(p => ({ label: p.title, value: p.title }))}
            selectedValuesStr={formData.festivalTargetProduct || ''}
            onChange={(val) => setFormData({...formData, festivalTargetProduct: val})}
            placeholder="-- All Products --"
          />
        </div>
        <div className="admin-form-field full" style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', margin: 0, fontSize: '1rem' }}>
            <input 
              type="checkbox" 
              style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer' }} 
              checked={formData.isFestivalActive || false} 
              onChange={(e) => setFormData({...formData, isFestivalActive: e.target.checked})} 
            />
            Enable Festival Sale (Applies discount based on targets above & shows banner)
          </label>
        </div>
      </div>
      <Button 
        onClick={() => {
          if (!formData.isFestivalActive) {
            alert("Please select the check box to send a message or please check.");
            return;
          }
          handleSave();
        }} 
        disabled={isUpdating} 
        style={{ alignSelf: 'flex-start' }} 
        variant="primary"
      >
        {isUpdating ? 'Saving...' : 'Save Configuration'}
      </Button>
    </div>
  );
};

export default FestivalSalePanel;
