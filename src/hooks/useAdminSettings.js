import { useState, useEffect } from 'react';
import { useGetStoreSettingsQuery, useUpdateStoreSettingsMutation } from '../api/settingsApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminSettings = () => {
  const { pushToast } = useToast();
  const { data: settingsData, isLoading } = useGetStoreSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateStoreSettingsMutation();
  
  const [formData, setFormData] = useState({
    storeName: 'crafty_kiya',
    supportEmail: 'support@kiyaaccessories.com',
    contactNo: '+91 9876543210',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });


  useEffect(() => {
    if (settingsData) {
      setFormData({
        storeName: settingsData.storeName || '',
        supportEmail: settingsData.supportEmail || '',
        contactNo: settingsData.contactNo || '',
        address: settingsData.address || '',
        city: settingsData.city || '',
        state: settingsData.state || '',
        pincode: settingsData.pincode || ''
      });
    }
  }, [settingsData]);


  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        contactNo: formData.contactNo.replace(/\s+/g, '')
      };
      await updateSettings(payload).unwrap();
      pushToast('Store settings updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update settings:', err);
      pushToast('Failed to update store settings.', 'error');
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
