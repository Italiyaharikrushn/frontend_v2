import { useState, useEffect } from 'react';
import { useGetFestivalSettingsQuery, useUpdateFestivalSettingsMutation } from '../api/festivalApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminFestival = () => {
  const { pushToast } = useToast();
  const { data: festivalData, isLoading } = useGetFestivalSettingsQuery();
  const [updateFestival, { isLoading: isUpdating }] = useUpdateFestivalSettingsMutation();
  
  const [formData, setFormData] = useState({
    festivalName: '',
    festivalStartDate: '',
    festivalEndDate: '',
    isFestivalActive: false,
    festivalDiscountPercentage: '',
    festivalTargetCategory: '',
    festivalTargetProduct: ''
  });

  useEffect(() => {
    if (festivalData) {
      setFormData({
        festivalName: festivalData.festivalName || '',
        festivalStartDate: festivalData.festivalStartDate || '',
        festivalEndDate: festivalData.festivalEndDate || '',
        isFestivalActive: festivalData.isFestivalActive || false,
        festivalDiscountPercentage: festivalData.festivalDiscountPercentage || '',
        festivalTargetCategory: festivalData.festivalTargetCategory || '',
        festivalTargetProduct: festivalData.festivalTargetProduct || ''
      });
    }
  }, [festivalData]);

  const handleSave = async () => {
    try {
      await updateFestival(formData).unwrap();
      pushToast('Festival sale configuration updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update festival settings:', err);
      pushToast('Failed to update festival settings.', 'error');
    }
  };

  return {
    formData,
    setFormData,
    handleSave,
    isLoading,
    isUpdating
  };
};
