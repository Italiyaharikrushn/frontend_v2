import { useState, useEffect, useCallback } from 'react';
import { useGetStorePolicyQuery, useUpdateStorePolicyMutation } from '../api/policyApi';

export const useAdminPolicies = () => {
  const { data: policyData, isLoading, refetch } = useGetStorePolicyQuery();
  const [updateStorePolicy, { isLoading: isUpdating }] = useUpdateStorePolicyMutation();
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'rules', or policy id
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    if (policyData && activeModal) {
      if (activeModal === 'rules') {
        setModalData({
          isReturnsAccepted: policyData.isReturnsAccepted !== false,
          returnWindow: policyData.returnWindow || "7 days",
          startingFrom: policyData.startingFrom || "Delivery of item",
          extendWeekends: policyData.extendWeekends || false,
          returnShipping: policyData.returnShipping || "Free return shipping",
          restockingFee: policyData.restockingFee || false,
          isCancellationAccepted: policyData.isCancellationAccepted !== false,
          cancellationWindow: policyData.cancellationWindow || "15 minutes",
          shippingCharge: policyData.shippingCharge !== undefined && policyData.shippingCharge !== null ? policyData.shippingCharge : 0,
          taxPercentage: policyData.taxPercentage !== undefined && policyData.taxPercentage !== null ? policyData.taxPercentage : 0
        });
      } else {
        setModalData({
          [activeModal]: policyData[activeModal] || ''
        });
      }
    }
  }, [activeModal, policyData]);

  const handleSaveModal = async () => {
    setFeedback({ type: '', text: '' });
    try {
      await updateStorePolicy(modalData).unwrap();
      setFeedback({ type: 'success', text: 'Policy settings updated successfully!' });
      setActiveModal(null);
    } catch (error) {
      console.error('Failed to save policy', error);
      setFeedback({ type: 'error', text: 'Failed to save. Please try again.' });
    }
  };

  const getPolicyStatus = useCallback((id) => {
    if (!policyData) return { text: 'No policy set', type: 'empty' };

    if (id === 'contactInformation' && policyData[id] && policyData[id].trim() !== '') {
      return { text: 'Required', type: 'required' };
    }

    return policyData[id] && policyData[id].trim() !== ''
      ? { text: 'Policy set', type: 'set' }
      : { text: 'No policy set', type: 'empty' };
  }, [policyData]);

  return {
    policyData,
    isLoading,
    isUpdating,
    refetch,
    feedback,
    activeModal,
    setActiveModal,
    modalData,
    setModalData,
    handleSaveModal,
    getPolicyStatus
  };
};
