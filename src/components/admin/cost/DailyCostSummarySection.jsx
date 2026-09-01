import React, { useState, useMemo } from 'react';
import { Calendar, IndianRupee } from 'lucide-react';
import { useGetDailyCostsByDateQuery, useGetShippingCostsByDateQuery } from '../../../api/costManagementApi';

const DailyCostSummarySection = () => {
    // Default to today's date (local timezone)
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayDateString = getTodayDateString();
    const [selectedDate, setSelectedDate] = useState(todayDateString);

    const { data: costs, isLoading: isCostsLoading } = useGetDailyCostsByDateQuery(selectedDate);
    const { data: shippingCosts, isLoading: isShippingLoading } = useGetShippingCostsByDateQuery(selectedDate);
    const isLoading = isCostsLoading || isShippingLoading;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    // Group costs by product name and include shipping costs
    const groupedCosts = useMemo(() => {
        const grouped = (costs || []).reduce((acc, curr) => {
            if (!acc[curr.productName]) {
                acc[curr.productName] = {
                    productName: curr.productName,
                    costType: curr.costType,
                    unit: curr.unit,
                    totalUnits: curr.quantity,
                    totalCost: curr.totalCost,
                    category: curr.category,
                    date: curr.costDate
                };
            } else {
                acc[curr.productName].totalUnits += curr.quantity;
                acc[curr.productName].totalCost += curr.totalCost;
            }
            return acc;
        }, {});

        const result = Object.values(grouped).map(item => ({
            ...item,
            // Calculate average unit price based on total cost and total units
            unitPrice: item.totalUnits > 0 ? (item.totalCost / item.totalUnits) : 0,
            isShipping: false
        }));

        // Append shipping costs
        (shippingCosts || []).forEach(shipping => {
            result.push({
                productName: `Shipping - ${shipping.description}`,
                costType: 'Shipping',
                unit: '-',
                totalUnits: 0,
                totalCost: shipping.amount,
                unitPrice: shipping.amount,
                category: 'Logistics',
                date: shipping.costDate,
                isShipping: true
            });
        });

        return result;
    }, [costs, shippingCosts]);

    const totalDailyCost = useMemo(() => {
        return groupedCosts.reduce((sum, item) => sum + item.totalCost, 0);
    }, [groupedCosts]);

    const totalProducts = groupedCosts.filter(item => !item.isShipping).length;
    const totalCostEntries = (costs ? costs.length : 0) + (shippingCosts ? shippingCosts.length : 0);
    const totalUnits = useMemo(() => {
        return groupedCosts.reduce((sum, item) => sum + item.totalUnits, 0);
    }, [groupedCosts]);

    return (
        <div className="daily-costs-tab-content">
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Calendar style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)' }} />
                        Daily Costs Analytics
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.95rem' }}>View and analyze product-wise costs for a specific date.</p>
                </div>

                <div className="cost-filters-bar" style={{ marginBottom: 0, padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="summaryDate" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Selected Date:</label>
                    <input
                        type="date"
                        id="summaryDate"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={todayDateString}
                        className="cost-form-input"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                    />
                </div>
            </div>

            <div className="cost-summary-cards">
                <div className="cost-summary-card highlight">
                    <h3>Total Daily Cost</h3>
                    <p style={{ color: 'var(--primary)' }}>{formatCurrency(totalDailyCost)}</p>
                </div>
                <div className="cost-summary-card">
                    <h3>Total Products</h3>
                    <p>{totalProducts}</p>
                </div>
                <div className="cost-summary-card">
                    <h3>Total Cost Entries</h3>
                    <p>{totalCostEntries}</p>
                </div>
                <div className="cost-summary-card">
                    <h3>Total Units</h3>
                    <p>{new Intl.NumberFormat('en-IN').format(totalUnits)}</p>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Cost Type</th>
                            <th>Unit</th>
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Total Units</th>
                            <th className="text-right">Total Cost</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">Loading daily costs...</td>
                            </tr>
                        ) : groupedCosts.length > 0 ? (
                            groupedCosts.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="font-medium">{item.productName}</td>
                                    <td>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                            {item.costType}
                                        </span>
                                    </td>
                                    <td>{item.unit}</td>
                                    <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                                    <td className="text-right font-medium">{item.isShipping ? '-' : `${item.totalUnits} ${item.unit}`}</td>
                                    <td className="text-right font-semibold text-primary">{formatCurrency(item.totalCost)}</td>
                                    <td>{item.category}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                    No cost records found for this date.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailyCostSummarySection;
