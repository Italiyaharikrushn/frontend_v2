import React, { useState } from 'react';
import AdminDiscountTab from '../../components/admin/AdminDiscountTab';
import AdminCouponsTab from '../../components/admin/AdminCouponsTab';
import { Ticket, Gift, PartyPopper } from 'lucide-react';
import '@/styles/pages/admin/AdminStyles.css';

const AdminPromotions = () => {
    const [activeTab, setActiveTab] = useState('DISCOUNTS');

    return (
        <div className="admin-page fade-in">
            <div className="admin-header" style={{ marginBottom: '1.5rem' }}>
                <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Gift size={24} style={{ color: 'var(--primary)' }} /> Promotions & Offers
                </h1>
            </div>

            <div className="admin-tabs" style={{ 
                display: 'flex', 
                gap: '1rem', 
                borderBottom: '1px solid var(--border)', 
                marginBottom: '2rem' 
            }}>
                <button 
                    onClick={() => setActiveTab('DISCOUNTS')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'DISCOUNTS' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'DISCOUNTS' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem'
                    }}
                >
                    <PartyPopper size={20} /> Store Discounts
                </button>
                <button 
                    onClick={() => setActiveTab('COUPONS')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'COUPONS' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'COUPONS' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem'
                    }}
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
