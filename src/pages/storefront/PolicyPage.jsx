import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGetStorePolicyQuery } from '../../api/policyApi';
import { Loader } from 'lucide-react';

const POLICY_TYPES = {
  'return-and-refund': {
    title: 'Return & Refund Policy',
    key: 'returnAndRefundPolicy'
  },
  'terms-of-service': {
    title: 'Terms of Service',
    key: 'termsOfService'
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    key: 'shippingPolicy'
  },
  'contact-information': {
    title: 'Contact Information',
    key: 'contactInformation'
  },
  'legal-notice': {
    title: 'Legal Notice',
    key: 'legalNotice'
  }
};

const PolicyPage = () => {
  const { type } = useParams();
  const { data: policyData, isLoading, isError } = useGetStorePolicyQuery();

  const policyConfig = POLICY_TYPES[type];

  if (!policyConfig) {
    return <Navigate to="/404" replace />;
  }

  const policyContent = policyData?.[policyConfig.key] || 'No policy defined yet.';

  if (isError) {
    return (
      <div className="static-page fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-dark)' }}>{policyConfig.title}</h1>
        <div style={{ textAlign: 'center', color: 'var(--error)' }}>Failed to load policy.</div>
      </div>
    );
  }

  return (
    <div className="static-page fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-dark)' }}>{policyConfig.title}</h1>
      {isLoading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader className="spin" size={24} color="var(--primary)" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>
          {policyContent}
        </div>
      )}
    </div>
  );
};

export default PolicyPage;
