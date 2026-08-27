import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useGetMonthlyCostReportQuery } from '../../../api/costManagementApi';
import { toast } from 'react-toastify';
import { getCurrentMonth, getCurrentYear } from '../../../utils/dateUtils';

const MonthlyCostDashboard = () => {
    const [filters, setFilters] = useState({
        month: getCurrentMonth(), // 1-12
        year: getCurrentYear(),
    });

    const { data: report, isLoading } = useGetMonthlyCostReportQuery(filters);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value) || value
        }));
    };

    const exportToCSV = () => {
        if (!report || !report.entries || report.entries.length === 0) {
            toast.info("No data to export");
            return;
        }

        const headers = ["Date", "Product", "Quantity", "Unit", "Total Cost"];
        const csvRows = [];
        csvRows.push(headers.join(','));

        report.entries.forEach(row => {
            const values = [
                row.costDate,
                `"${row.productName || 'N/A'}"`,
                row.quantity,
                `"${row.unit}"`,
                row.totalCost,
            ];
            csvRows.push(values.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);

        const monthName = new Date(filters.year, filters.month - 1).toLocaleString('default', { month: 'long' });
        link.setAttribute("download", `cost-report-${monthName}-${filters.year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    return (
        <div>
            <div className="cost-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>Monthly Purchase Report</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)', margin: 0 }}>Month:</label>
                        <select name="month" value={filters.month} onChange={handleFilterChange} className="cost-form-select" style={{ width: '140px', padding: '0.4rem 2rem 0.4rem 0.75rem' }}>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)', margin: 0 }}>Year:</label>
                        <input type="number" name="year" value={filters.year} onChange={handleFilterChange} min="2020" max="2100" className="cost-form-input" style={{ width: '100px', padding: '0.4rem 0.75rem' }} />
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="cost-action-btn cost-action-btn-secondary"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {isLoading ? (
                <p>Loading reports...</p>
            ) : report ? (
                <>
                    {/* Grid Layout for Breakdown and Purchases */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Shipping Table */}
                        <div className="admin-table-container">
                            <div className="cost-table-header" style={{ cursor: 'default' }}>
                                <h3>Detailed Shipping Costs</h3>
                            </div>

                            <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description / Courier</th>
                                            <th>Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.shippingEntries && report.shippingEntries.length > 0 ? report.shippingEntries.map((entry) => (
                                            <tr key={entry.id}>
                                                <td>{new Date(entry.costDate).toLocaleDateString()}</td>
                                                <td>{entry.description || '-'}</td>
                                                <td className="font-semibold text-primary">{formatCurrency(entry.amount)}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-gray-500">No shipping costs found for the selected filters.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Purchases Table */}
                        <div className="admin-table-container">
                            <div className="cost-table-header" style={{ cursor: 'default' }}>
                                <h3>Detailed Purchases</h3>
                            </div>

                            <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.purchaseEntries && report.purchaseEntries.length > 0 ? report.purchaseEntries.map((entry) => (
                                            <tr key={entry.id}>
                                                <td>{new Date(entry.costDate).toLocaleDateString()}</td>
                                                <td>{entry.productName || '-'}</td>
                                                <td>{entry.quantity} {entry.unit}</td>
                                                <td className="font-semibold text-primary">{formatCurrency(entry.totalCost)}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-gray-500">No purchases found for the selected filters.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Daily Breakdown Table */}
                    <div className="admin-table-container">
                        <div className="cost-table-header" style={{ cursor: 'default' }}>
                            <h3>Daily Breakdown</h3>
                        </div>

                        <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th style={{ textAlign: 'right' }}>Purchases</th>
                                        <th style={{ textAlign: 'right' }}>Shipping</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.dailyBreakdown && Object.keys(report.dailyBreakdown).map((dateStr) => {
                                        const d = report.dailyBreakdown[dateStr];
                                        return (
                                            <tr key={dateStr}>
                                                <td>{new Date(dateStr).toLocaleDateString()}</td>
                                                <td style={{ textAlign: 'right' }}>{formatCurrency(d.totalPurchases)}</td>
                                                <td style={{ textAlign: 'right' }}>{formatCurrency(d.totalShipping)}</td>
                                                <td style={{ textAlign: 'right' }} className="font-semibold text-primary">{formatCurrency(d.total)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default MonthlyCostDashboard;
