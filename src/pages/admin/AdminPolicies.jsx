import React from 'react';
import { FileText, ChevronRight, Loader, CheckCircle2, AlertCircle, PlusCircle, MoreHorizontal } from 'lucide-react';
import { useAdminPolicies } from '../../hooks/useAdminPolicies';
import { WRITTEN_POLICIES } from '../../utils/policyConstants';
import PolicyModal from '../../components/admin/PolicyModal';

import '@/styles/pages/admin/AdminStyles.css';
import '@/styles/pages/admin/AdminPolicies.css';

const AdminPolicies = () => {
  const {
    policyData,
    isLoading,
    isUpdating,
    feedback,
    activeModal,
    setActiveModal,
    modalData,
    setModalData,
    handleSaveModal,
    getPolicyStatus
  } = useAdminPolicies();

  if (isLoading) {
    return (
      <div className="admin-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <Loader className="spin" size={24} color="var(--primary)" /> Loading Policies...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in admin-policies-container">

      {/* Title */}
      <div className="admin-policies-title-container">
        <FileText size={24} color="var(--text-main)" />
        <h1 className="admin-policies-title">Policies</h1>
      </div>

      {feedback.text && (
        <div className={`policy-status-banner ${feedback.type}`} style={{ marginBottom: '1.5rem' }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Return and cancellation rules Card */}
      <div className="policy-card">
        <div className="policy-card-header">
          <h2 className="policy-card-title">Return and cancellation rules</h2>
          <p className="policy-card-subtitle">Set conditions and fees for return and cancellation requests</p>
        </div>

        <div className="policy-card-body">
          <div className="policy-row" onClick={() => setActiveModal('rules')}>
            <span className="policy-row-label">Default rules</span>
            <div className="policy-row-right">
              <span className="policy-pill">
                {policyData?.isReturnsAccepted ? (policyData.returnWindow || '7 days') : 'No rules set'}
              </span>
              <ChevronRight size={18} color="#9ca3af" />
            </div>
          </div>
        </div>
      </div>

      {/* Written policies Card */}
      <div className="policy-card">
        <div className="policy-card-header">
          <h2 className="policy-card-title">Written policies</h2>
          <p className="policy-card-subtitle">
            Policies are linked in the footer of checkout
          </p>
        </div>

        <div className="policy-card-body-no-gap">
          <div className="policy-list-container">
            {WRITTEN_POLICIES.map((policy) => {
              const status = getPolicyStatus(policy.id);

              const isAutomated = status.type === 'automated';
              const isRequired = status.type === 'required';

              const pillClass = isAutomated
                ? 'policy-pill policy-pill-automated'
                : isRequired
                  ? 'policy-pill policy-pill-required'
                  : 'policy-pill';

              return (
                <div
                  key={policy.id}
                  className="policy-list-item"
                  onClick={() => setActiveModal(policy.id)}
                >
                  <div className="policy-list-item-left">
                    <span className="policy-list-item-icon">{policy.icon}</span>
                    <span className="policy-list-item-label">{policy.label}</span>
                  </div>
                  <div className="policy-row-right">
                    <div className={pillClass}>
                      {isAutomated && <div className="policy-pill-dot" />}
                      {status.text}
                    </div>
                    <ChevronRight size={18} color="#9ca3af" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <PolicyModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        modalData={modalData}
        setModalData={setModalData}
        handleSaveModal={handleSaveModal}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default AdminPolicies;
