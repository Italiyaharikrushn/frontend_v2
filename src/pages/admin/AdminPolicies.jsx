import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetReturnPolicyQuery, useUpdateReturnPolicyMutation } from '../../api/policyApi';
import '@/styles/pages/admin/AdminStyles.css';

const AdminPolicies = () => {
  const [policyContent, setPolicyContent] = useState('');
  const [isReturnsAccepted, setIsReturnsAccepted] = useState(true);
  const [returnWindowDays, setReturnWindowDays] = useState(7);
  const { data: policyData, isLoading, refetch } = useGetReturnPolicyQuery();
  const [updateReturnPolicy, { isLoading: isUpdating }] = useUpdateReturnPolicyMutation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (policyData) {
      setPolicyContent(policyData.policyContent || '');
      setIsReturnsAccepted(policyData.isReturnsAccepted !== false);
      setReturnWindowDays(policyData.returnWindowDays || 7);
    }
  }, [policyData]);

  const handleSave = async () => {
    setMessage('');
    try {
      await updateReturnPolicy({
        policyContent,
        isReturnsAccepted,
        returnWindowDays: parseInt(returnWindowDays)
      }).unwrap();
      setMessage('Policy saved successfully!');
    } catch (error) {
      console.error('Failed to save policy', error);
      setMessage('Failed to save policy.');
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Store Policies</h1>
        <div className="admin-actions">
          <Button variant="primary" onClick={handleSave} disabled={isUpdating} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Save size={18} /> {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="glass-panel admin-panel-card">
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Return Policy Settings</h2>
        
        {message && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', background: message.includes('success') ? '#d4edda' : '#f8d7da', color: message.includes('success') ? '#155724' : '#721c24' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={isReturnsAccepted} 
              onChange={(e) => setIsReturnsAccepted(e.target.checked)} 
            />
            Accept Returns
          </label>

          {isReturnsAccepted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Return Window (Days)</label>
              <input 
                type="number" 
                value={returnWindowDays} 
                onChange={(e) => setReturnWindowDays(e.target.value)}
                min="1"
                className="input-field"
                style={{ width: '150px' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500' }}>Return Policy Content</label>
            <textarea 
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              className="input-field"
              rows="10"
              placeholder="Enter your return policy here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPolicies;
