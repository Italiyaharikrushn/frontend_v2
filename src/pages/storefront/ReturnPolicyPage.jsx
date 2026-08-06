import React from 'react';
import { useGetReturnPolicyQuery } from '../../api/policyApi';

const ReturnPolicyPage = () => {
  const { data: policyData, isLoading, isError } = useGetReturnPolicyQuery();
  
  const policyContent = policyData?.policyContent || 'No policy defined yet.';

  if (isError) {
    return (
      <div className="static-page fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-dark)' }}>Return & Refund Policy</h1>
        <div style={{ textAlign: 'center', color: 'var(--error)' }}>Failed to load return policy.</div>
      </div>
    );
  }

  return (
    <div className="static-page fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-dark)' }}>Return & Refund Policy</h1>
      {isLoading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div>
      ) : (
        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>
          {policyContent}
        </div>
      )}
    </div>
  );
};

export default ReturnPolicyPage;
