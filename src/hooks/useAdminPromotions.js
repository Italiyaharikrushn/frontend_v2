import { useState } from 'react';

export const useAdminPromotions = () => {
    const [activeTab, setActiveTab] = useState('DISCOUNTS');

    return {
        activeTab,
        setActiveTab
    };
};
