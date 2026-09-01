import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useGetYearlyCostReportQuery } from '../../../api/costManagementApi';
import { toast } from 'react-toastify';
import { getCurrentYear } from '../../../utils/dateUtils';

const YearlyCostDashboard = () => {
    const [filters, setFilters] = useState({
        year: getCurrentYear(),
    });

    const { data: report, isLoading } = useGetYearlyCostReportQuery(filters);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value) || value
        }));
    };

    const exportToCSV = () => {
        if (!report || !report.monthlyBreakdown) {
            toast.info("No data to export");
            return;
        }

        const headers = ["Month", "Total Purchases"];
        const csvRows = [];
        csvRows.push(headers.join(','));

        Object.values(report.monthlyBreakdown).forEach(row => {
            const values = [
                row.monthName,
                row.totalPurchases,
                row.totalShipping,
                row.total
            ];
            csvRows.push(values.join(','));
        });

        // Add overall total row
        csvRows.push(['Total Yearly Expenses', report.totalPurchaseExpense, report.totalShippingExpense, report.totalOverallExpense].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);

        link.setAttribute("download", `cost-report-${filters.year}.csv`);
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
                <h2 className="text-xl font-semibold" style={{ margin: 0 }}>Yearly Expense Report</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
                <p className="text-center py-4">Loading reports...</p>
            ) : report ? (
                <>
                    <div className="cost-summary-cards" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="cost-summary-card highlight" style={{ flex: '1 1 200px' }}>
                            <h3>Total Yearly Expenses</h3>
                            <p>{formatCurrency(report.totalOverallExpense)}</p>
                        </div>
                        <div className="cost-summary-card" style={{ flex: '1 1 200px' }}>
                            <h3>Total Purchases</h3>
                            <p>{formatCurrency(report.totalPurchaseExpense)}</p>
                        </div>
                        <div className="cost-summary-card" style={{ flex: '1 1 200px' }}>
                            <h3>Total Shipping</h3>
                            <p>{formatCurrency(report.totalShippingExpense)}</p>
                        </div>
                    </div>

                    {/* Entries Table */}
                    <div className="admin-table-container">
                        <div className="cost-table-header" style={{ cursor: 'default' }}>
                            <h3>Monthly Breakdown</h3>
                        </div>

                        <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th style={{ textAlign: 'right' }}>Purchases</th>
                                        <th style={{ textAlign: 'right' }}>Shipping</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.monthlyBreakdown && Object.values(report.monthlyBreakdown).map((m) => (
                                        <tr key={m.monthNumber}>
                                            <td>{m.monthName}</td>
                                            <td style={{ textAlign: 'right' }}>{formatCurrency(m.totalPurchases)}</td>
                                            <td style={{ textAlign: 'right' }}>{formatCurrency(m.totalShipping)}</td>
                                            <td style={{ textAlign: 'right' }} className="font-semibold text-primary">{formatCurrency(m.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background: 'var(--surface-alt)', fontWeight: 'bold' }}>
                                        <td>Total Yearly Expense</td>
                                        <td style={{ textAlign: 'right' }}>{formatCurrency(report.totalPurchaseExpense)}</td>
                                        <td style={{ textAlign: 'right' }}>{formatCurrency(report.totalShippingExpense)}</td>
                                        <td style={{ textAlign: 'right' }} className="text-primary">{formatCurrency(report.totalOverallExpense)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default YearlyCostDashboard;
