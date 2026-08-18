import { useState, useEffect } from 'react';
import { useGetStoreSettingsQuery, useUpdateStoreSettingsMutation } from '../api/settingsApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminSettings = () => {
  const { pushToast } = useToast();
  const { data: settingsData, isLoading } = useGetStoreSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateStoreSettingsMutation();

  const [formData, setFormData] = useState({
    storeName: '',
    supportEmail: '',
    contactNo: '',
    timingDays: 'Mon-Sun',
    timingOpen: '10:00 AM',
    timingClose: '10:00 PM',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profilePhoto: ''
  });


  useEffect(() => {
    if (settingsData && settingsData.settings) {
      const contacts = settingsData.settings.contacts || {};
      const storeSettings = settingsData.settings.storeSettings || {};
      const address = contacts.address || {};
      const timingStr = contacts.timing || 'Mon-Sun, 10:00 AM - 10:00 PM (IST)';
      const match = timingStr.match(/^(.*?), (.*?) - (.*?) \(IST\)$/);

      setFormData({
        storeName: storeSettings.storeName || '',
        supportEmail: contacts.email || '',
        contactNo: contacts.phone || '',
        timingDays: match ? match[1] : 'Mon-Sun',
        timingOpen: match ? match[2] : '10:00 AM',
        timingClose: match ? match[3] : '10:00 PM',
        address: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        profilePhoto: storeSettings.profilePhoto || ''
      });
    }
  }, [settingsData]);


  const handleSave = async () => {
    try {
      const payload = {
        settings: {
          contacts: {
            phone: formData.contactNo.replace(/\s+/g, ''),
            email: formData.supportEmail,
            timing: `${formData.timingDays}, ${formData.timingOpen} - ${formData.timingClose} (IST)`,
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode
            }
          },
          storeSettings: {
            storeName: formData.storeName,
            profilePhoto: formData.profilePhoto
          }
        }
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
