import { useState } from 'react';
import { useSubmitMessageMutation } from '../api/contactApi';
import { useGetPublicStoreSettingsQuery } from '../api/settingsApi';
import { useToast } from '../components/ui/ToastProvider';

export const useContact = () => {
    const { pushToast } = useToast();
    const { data: storeSettings, isLoading: isSettingsLoading } = useGetPublicStoreSettingsQuery();
    const [submitMessage, { isLoading }] = useSubmitMessageMutation();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitMessage(formData).unwrap();
            pushToast('Thank you for contacting us. We will get back to you shortly.', 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('Failed to submit message:', err);
            pushToast('Failed to send message. Please try again.', 'error');
        }
    };

    return { storeSettings, isSettingsLoading, isLoading, formData, handleChange, handleSubmit };
};
