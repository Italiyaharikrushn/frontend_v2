import React from 'react';
import { Tag } from 'lucide-react';
import Button from '../ui/Button';

const FestivalSalePanel = ({ formData, setFormData, handleSave, isUpdating }) => {
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
            value={formData.festivalEndDate} 
            onChange={(e) => setFormData({...formData, festivalEndDate: e.target.value})} 
          />
        </div>
        <div className="admin-form-field full" style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', margin: 0, fontSize: '1rem' }}>
            <input 
              type="checkbox" 
              style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer' }} 
              checked={formData.isFestivalActive} 
              onChange={(e) => setFormData({...formData, isFestivalActive: e.target.checked})} 
            />
            Enable Storewide Festival Sale (Applies discount & shows banner)
          </label>
        </div>
      </div>
      <Button onClick={handleSave} disabled={isUpdating} style={{ alignSelf: 'flex-start' }} variant="primary">
        {isUpdating ? 'Saving...' : 'Save Configuration'}
      </Button>
    </div>
  );
};

export default FestivalSalePanel;
