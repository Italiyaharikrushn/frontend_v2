import React from 'react';
import { useGetYesterdayDailyCostsQuery } from '../../../api/costManagementApi';
import { Calendar, TrendingDown } from 'lucide-react';

const YesterdayPurchasesWidget = () => {
    const { data: yesterdayCosts, isLoading } = useGetYesterdayDailyCostsQuery();

    if (isLoading) {
        return <div className="cost-summary-card"><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading yesterday's summary...</p></div>;
    }

    if (!yesterdayCosts || yesterdayCosts.length === 0) {
        return (
            <div className="cost-summary-card">
                <h3>Yesterday's Purchases</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>No purchases were made yesterday.</p>
            </div>
        );
    }

    const totalAmount = yesterdayCosts.reduce((acc, curr) => acc + curr.totalCost, 0);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    return (
        <div className="cost-summary-card highlight" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
                        <Calendar size={16} />
                        Yesterday's Summary
                    </h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: 'var(--text-main)' }}>{formatCurrency(totalAmount)}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total spent on {yesterdayCosts.length} item(s)</p>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: '#ef4444' }}>
                    <TrendingDown size={20} />
                </div>
            </div>
            
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Items Purchased:</h4>
                <div style={{ maxHeight: '10rem', overflowY: 'auto', paddingRight: '0.5rem', scrollbarWidth: 'thin' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                        {yesterdayCosts.map(item => (
                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                                    {item.productName} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({item.quantity} {item.unit})</span>
                                </span>
                                <span style={{ fontWeight: '600' }}>{formatCurrency(item.totalCost)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default YesterdayPurchasesWidget;
