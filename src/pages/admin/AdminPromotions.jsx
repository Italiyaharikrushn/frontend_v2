import React from 'react';
import AdminDiscountTab from '../../components/admin/AdminDiscountTab';
import AdminCouponsTab from '../../components/admin/AdminCouponsTab';
import { Ticket, Gift, PartyPopper } from 'lucide-react';
import { useAdminPromotions } from '../../hooks/useAdminPromotions';
import '@/styles/pages/admin/AdminStyles.css';
import '@/styles/pages/admin/AdminPromotions.css';

const AdminPromotions = () => {
    const { activeTab, setActiveTab } = useAdminPromotions();

    return (
        <div className="admin-page fade-in">
            <div className="admin-header admin-promotions-header">
                <h1 className="admin-title admin-promotions-title">
                    <Gift size={24} className="admin-promotions-title-icon" /> Promotions & Offers
                </h1>
            </div>

            <div className="admin-promotions-tabs">
                <button
                    onClick={() => setActiveTab('DISCOUNTS')}
                    className={`admin-promotions-tab-btn ${activeTab === 'DISCOUNTS' ? 'active' : ''}`}
                >
                    <PartyPopper size={20} /> Store Discounts
                </button>
                <button
                    onClick={() => setActiveTab('COUPONS')}
                    className={`admin-promotions-tab-btn ${activeTab === 'COUPONS' ? 'active' : ''}`}
                >
                    <Ticket size={18} /> Promo Coupons
                </button>
            </div>

            <div className="admin-tab-content">
                {activeTab === 'DISCOUNTS' && <AdminDiscountTab />}
                {activeTab === 'COUPONS' && <AdminCouponsTab />}
            </div>
        </div>
    );
};

export default AdminPromotions;
