import React, { useState, useEffect } from 'react';
import { useGetCostAnalyticsQuery, useGetCostFiltersQuery } from '../../../api/costManagementApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import '../../../styles/pages/admin/AdminCostManagement.css'; // Reuse existing styles
import { getCurrentDate, getCurrentYear, formatToISODate } from '../../../utils/dateUtils';

const CostAnalyticsChart = () => {
    const [view, setView] = useState('month');
    const [comparison, setComparison] = useState('previous');
    const [category, setCategory] = useState('All');
    const [costType, setCostType] = useState('All');

    // For specific date selections
    const [selectedDate, setSelectedDate] = useState(formatToISODate(getCurrentDate()));
    const [fromYear, setFromYear] = useState(getCurrentYear() - 4);
    const [toYear, setToYear] = useState(getCurrentYear());

    const { data: filtersData } = useGetCostFiltersQuery();

    const { data: analyticsData, isLoading, isError, refetch } = useGetCostAnalyticsQuery({
        view,
        fromYear: view === 'year' ? fromYear : undefined,
        toYear: view === 'year' ? toYear : undefined,
        category,
        costType,
        comparison
    });

    const handleReset = () => {
        setView('month');
        setComparison('previous');
        setCategory('All');
        setCostType('All');
        setSelectedDate(formatToISODate(getCurrentDate()));
        setFromYear(getCurrentYear() - 4);
        setToYear(getCurrentYear());
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const renderSummaryCards = () => {
        if (!analyticsData) return null;

        const currentTotal = analyticsData.currentPeriod?.totalCost || 0;
        const previousTotal = analyticsData.comparisonPeriod?.totalCost || 0;
        const difference = currentTotal - previousTotal;

        let growth = 0;
        if (previousTotal > 0) {
            growth = (difference / previousTotal) * 100;
        } else if (currentTotal > 0 && previousTotal === 0) {
            growth = 100; // or infinity logically, but cap at 100% for display
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const currentVal = payload[0]?.value || 0;
            const previousVal = payload[1]?.value || 0;
            const diff = currentVal - previousVal;
            let percentChange = 0;
            if (previousVal > 0) percentChange = (diff / previousVal) * 100;
            else if (currentVal > 0 && previousVal === 0) percentChange = 100;

            return (
                <div style={{ background: 'var(--surface)', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{view === 'day' ? 'Day ' : ''}{label}</p>
                    <p style={{ color: 'var(--primary)', margin: '0.25rem 0' }}>Current: {formatCurrency(currentVal)}</p>
                    {view !== 'year' && <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0' }}>Previous: {formatCurrency(previousVal)}</p>}
                    {view !== 'year' && (
                        <>
                            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                            <p style={{ color: diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'var(--text-main)', margin: '0.25rem 0' }}>
                                Diff: {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                            </p>
                            <p style={{ color: percentChange > 0 ? 'var(--danger)' : percentChange < 0 ? 'var(--success)' : 'var(--text-main)', margin: '0.25rem 0' }}>
                                Change: {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
                            </p>
                        </>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '0' }}>
            {/* Header with Title and Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="chart-title" style={{ margin: 0 }}>Cost Trend</h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: '8px', padding: '0.25rem', border: '1px solid var(--border)' }}>
                        {['day', 'month', 'year'].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: view === v ? 'var(--primary)' : 'transparent',
                                    color: view === v ? '#fff' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontWeight: view === v ? 600 : 400,
                                    textTransform: 'capitalize'
                                }}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    {view === 'year' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>From Year</label>
                                <input type="number" value={fromYear} onChange={(e) => setFromYear(parseInt(e.target.value))} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', width: '100px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>To Year</label>
                                <input type="number" value={toYear} onChange={(e) => setToYear(parseInt(e.target.value))} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', width: '100px' }} />
                            </div>
                        </div>
                    )}

                    <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', height: 'max-content' }}>
                        <RefreshCw size={16} />
                        Reset
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            {isLoading ?
                (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Loading cost analytics...</p>
                    </div>
                ) : isError ? (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ color: 'var(--danger)' }}>Unable to load cost analytics.</p>
                        <button onClick={refetch} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Retry</button>
                    </div>
                ) : !analyticsData?.data || analyticsData.data.length === 0 ? (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', flexDirection: 'column', gap: '0.5rem' }}>
                        <h3 style={{ color: 'var(--text-main)' }}>No cost data available</h3>
                        <p style={{ color: 'var(--text-muted)' }}>There are no cost records available for the selected filters. Try changing the date, category, or cost type.</p>
                    </div>
                )
                    : (
                        <div style={{ width: '100%', height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analyticsData.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="period" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} dy={10} />
                                    <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" name={`Current ${view === 'day' ? 'Month' : view === 'month' ? 'Year' : 'Selected Years'}`} dataKey="current" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                    {view !== 'year' && (
                                        <Line type="monotone" name={`Previous ${view === 'day' ? 'Month' : 'Year'}`} dataKey="previous" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: 'var(--text-muted)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
        </div>
    );
};

export default CostAnalyticsChart;
