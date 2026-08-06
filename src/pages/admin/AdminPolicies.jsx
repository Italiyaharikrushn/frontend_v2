import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, FileText, Calendar, ShieldCheck, Eye, Sparkles, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetReturnPolicyQuery, useUpdateReturnPolicyMutation } from '../../api/policyApi';
import '@/styles/pages/admin/AdminStyles.css';

const DEFAULT_POLICY_TEMPLATE = `Return & Refund Policy

Thank you for shopping with us! We want you to be completely satisfied with your purchase.

1. Eligibility for Returns
- Items must be returned within the designated return window from the date of delivery.
- Items must be unused, unworn, and in their original packaging with all tags attached.
- Proof of purchase (order confirmation or receipt) is required.

2. Non-Returnable Items
- Customized or personalized items.
- Final sale / clearance items.
- Products marked as non-returnable for hygiene reasons.

3. Refund Process
- Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
- If approved, your refund will be processed back to your original payment method within 5-7 business days.

4. Return Shipping
- Customers are responsible for return shipping costs unless the item received was damaged, defective, or incorrect.

If you have any questions, please contact our support team.`;

const AdminPolicies = () => {
  const [policyContent, setPolicyContent] = useState('');
  const [isReturnsAccepted, setIsReturnsAccepted] = useState(true);
  const [returnWindowDays, setReturnWindowDays] = useState(7);
  const { data: policyData, isLoading, refetch } = useGetReturnPolicyQuery();
  const [updateReturnPolicy, { isLoading: isUpdating }] = useUpdateReturnPolicyMutation();
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    if (policyData) {
      setPolicyContent(policyData.policyContent || '');
      setIsReturnsAccepted(policyData.isReturnsAccepted !== false);
      setReturnWindowDays(policyData.returnWindowDays || 7);
    }
  }, [policyData]);

  const handleSave = async () => {
    setFeedback({ type: '', text: '' });
    try {
      await updateReturnPolicy({
        policyContent,
        isReturnsAccepted,
        returnWindowDays: parseInt(returnWindowDays) || 7
      }).unwrap();
      setFeedback({ type: 'success', text: 'Return policy saved successfully!' });
    } catch (error) {
      console.error('Failed to save policy', error);
      setFeedback({ type: 'error', text: 'Failed to save policy. Please try again.' });
    }
  };

  const handleInsertTemplate = () => {
    if (!policyContent || window.confirm('This will replace your current policy content. Do you want to continue?')) {
      setPolicyContent(DEFAULT_POLICY_TEMPLATE);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <Loader className="spin" size={24} color="var(--primary)" /> Loading Return Policy...
        </div>
      </div>
    );
  }

  const wordCount = policyContent.trim() ? policyContent.trim().split(/\s+/).length : 0;
  const charCount = policyContent.length;

  return (
    <div className="admin-page fade-in">
      {/* Executive Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Store Policies</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Configure and publish customer return guidelines and return window limits
          </p>
        </div>
        <div className="admin-actions">
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={isUpdating} 
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            {isUpdating ? <Loader className="spin" size={18} /> : <Save size={18} />}
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="admin-two-column">
        {/* Left Column: Form Settings */}
        <div className="glass-panel admin-panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="policy-card-header">
            <h2 className="policy-card-title">
              <span className="admin-section-icon">
                <RotateCcw size={20} />
              </span>
              Return Policy Settings
            </h2>
          </div>

          {/* Feedback Alert Banner */}
          {feedback.text && (
            <div className={`policy-status-banner ${feedback.type}`}>
              {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Accept Returns Switch Box */}
          <div className="policy-toggle-box">
            <div className="policy-toggle-info">
              <div className="policy-toggle-title">
                <ShieldCheck size={18} color="var(--primary)" />
                Accept Customer Returns
              </div>
              <span className="policy-toggle-desc">
                Enable or disable product returns across your store
              </span>
            </div>
            <label className="policy-switch">
              <input 
                type="checkbox" 
                checked={isReturnsAccepted} 
                onChange={(e) => setIsReturnsAccepted(e.target.checked)} 
              />
              <span className="policy-slider" />
            </label>
          </div>

          {/* Return Window Field */}
          {isReturnsAccepted && (
            <div className="admin-form-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--primary)" /> Return Window Duration
              </label>
              <div className="policy-input-with-addon" style={{ maxWidth: '240px' }}>
                <input 
                  type="number" 
                  value={returnWindowDays} 
                  onChange={(e) => setReturnWindowDays(e.target.value)}
                  min="1"
                  max="365"
                  className="input-field"
                  placeholder="7"
                />
                <span className="policy-addon">Days</span>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Number of calendar days after delivery customers have to initiate returns.
              </span>
            </div>
          )}

          {/* Policy Text Area Field */}
          <div className="admin-form-field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="var(--primary)" /> Return Policy Content
            </label>
            <textarea 
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              className="input-field"
              rows="12"
              placeholder="Enter details about your return conditions, non-returnable items, and refund process..."
              style={{ lineHeight: '1.6', fontFamily: 'inherit' }}
            />
            <div className="policy-meta-row">
              <span>Write in plain text or Markdown format.</span>
              <span>{wordCount} words | {charCount} characters</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Storefront Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel admin-panel-card">
            <div className="policy-card-header">
              <h2 className="policy-card-title">
                <span className="admin-section-icon">
                  <Eye size={20} />
                </span>
                Storefront Live Preview
              </h2>
            </div>

            {/* Policy Summary Badges */}
            <div className="policy-preview-stats">
              <div className="policy-stat-item">
                <span className="policy-stat-label">Return Status</span>
                <span className="policy-stat-value">
                  <span className={`status-badge ${isReturnsAccepted ? 'status-active' : 'status-inactive'}`}>
                    {isReturnsAccepted ? 'Accepting Returns' : 'Returns Disabled'}
                  </span>
                </span>
              </div>
              <div className="policy-stat-item">
                <span className="policy-stat-label">Return Window</span>
                <span className="policy-stat-value">
                  {isReturnsAccepted ? `${returnWindowDays} Days` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Rendered Preview Box */}
            <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Customer View Preview:
            </div>
            <div className="policy-preview-box">
              {policyContent.trim() ? policyContent : <span style={{ color: 'var(--text-muted)', italic: true }}>No return policy text defined yet. Click "Load Template" to generate standard guidelines.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPolicies;

