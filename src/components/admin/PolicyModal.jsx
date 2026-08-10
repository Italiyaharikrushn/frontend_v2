import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { WRITTEN_POLICIES } from '../../utils/policyConstants';

const PolicyModal = ({ 
  activeModal, 
  setActiveModal, 
  modalData, 
  setModalData, 
  handleSaveModal, 
  isUpdating 
}) => {
  if (!activeModal) return null;

  const title = activeModal === 'rules' 
    ? 'Return Rules' 
    : WRITTEN_POLICIES.find(p => p.id === activeModal)?.label;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(17, 24, 39, 0.6)', zIndex: 1000, 
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
    onClick={() => setActiveModal(null)}
    >
      <div className="modal-content" style={{ 
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
        padding: '2rem', position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setActiveModal(null)}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>
          {title}
        </h2>

        {activeModal === 'rules' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={modalData.isReturnsAccepted || false}
                onChange={(e) => setModalData({...modalData, isReturnsAccepted: e.target.checked})}
                style={{ width: '1.2rem', height: '1.2rem' }}
              />
              <span style={{ color: '#374151', fontWeight: '500' }}>Accept Returns</span>
            </label>
            
            {modalData.isReturnsAccepted && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Return Window (Days)</label>
                <input 
                  type="number" 
                  value={modalData.returnWindowDays || ''}
                  onChange={(e) => setModalData({...modalData, returnWindowDays: parseInt(e.target.value) || 0})}
                  className="input-field"
                  style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.75rem', width: '100%' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Policy Content</label>
            <textarea 
              value={modalData[activeModal] || ''}
              onChange={(e) => setModalData({...modalData, [activeModal]: e.target.value})}
              className="input-field"
              rows="12"
              placeholder="Enter policy details here..."
              style={{ lineHeight: '1.6', fontFamily: 'inherit', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.75rem', width: '100%', resize: 'vertical' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveModal} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
