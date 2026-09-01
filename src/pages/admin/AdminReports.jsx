import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis, ComposedChart } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAdminReports } from '../../hooks/useAdminReports';
import CostAnalyticsChart from '../../components/admin/cost/CostAnalyticsChart';
import '@/styles/pages/admin/AdminStyles.css';
import { getCurrentYear } from '../../utils/dateUtils';

const AdminReports = () => {
    const {
        products,
        salesData,
        inventoryData,
        customerGrowthData,
        targetData,
        productPerformanceData,
        productSalesReportData,
        isProductSalesReportLoading,
        topProductsLimit, setTopProductsLimit,
        reportMonth, setReportMonth,
        reportYear, setReportYear,
        days, setDays,
        isLoading,
        isError
    } = useAdminReports();

    return (
        <div className="admin-page fade-in">
            <div className="admin-header">
                <h1 className="admin-title">Reports & Analytics</h1>
                <div className="admin-actions">
                    <div className="admin-form-field" style={{ margin: 0, minWidth: '150px' }}>
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                        </select>
                    </div>
                    <Button variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Download size={18} /> Download Report
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading chart data...</div>
            ) : isError ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>Failed to load chart data.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Top Row - Orders and Revenue */}
                    <div className="charts-grid">
                        <div className="glass-panel chart-card">
                            <h2 className="chart-title">All Orders</h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="orders" name="Number of Orders" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="glass-panel chart-card">
                            <h2 className="chart-title">Total Payment</h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="payment" name="Revenue (₹)" stroke="var(--success, #10b981)" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Middle Row - Inventory and Customers */}
                    <div className="charts-grid">
                        <div className="glass-panel chart-card">
                            <h2 className="chart-title">Inventory Health</h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={inventoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                    >
                                        {inventoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="glass-panel chart-card">
                            <h2 className="chart-title">Customer Growth</h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={customerGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="users" name="New Registrations" fill="#8b5cf6" barSize={30} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Row - Target Progress and Product Performance */}
                    <div className="charts-grid">
                        <div className="glass-panel chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 className="chart-title" style={{ alignSelf: 'flex-start' }}>Monthly Revenue Target</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    barSize={20}
                                    data={targetData.radialData}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div style={{ textAlign: 'center', marginTop: '-3rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{targetData.percentage}%</div>
                                <div style={{ color: 'var(--text-muted)' }}>₹{targetData.sales.toLocaleString()} of ₹{targetData.target.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="glass-panel chart-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 className="chart-title" style={{ margin: 0 }}>Top Products Performance (Views vs Sales)</h2>
                                <div className="admin-form-field" style={{ margin: 0, minWidth: '100px' }}>
                                    <select
                                        style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                                        value={topProductsLimit}
                                        onChange={(e) => setTopProductsLimit(Number(e.target.value))}
                                    >
                                        <option value={5}>Top 5</option>
                                        <option value={10}>Top 10</option>
                                        <option value={15}>Top 15</option>
                                        <option value={20}>Top 20</option>
                                    </select>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                                <ComposedChart data={productPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                                    <YAxis yAxisId="left" tickLine={false} axisLine={false} allowDecimals={false} />
                                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="views" name="Product Views" barSize={20} fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="sales" name="Total Sold" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="charts-grid">
                        {/* Product Sales Report */}
                        <div className="glass-panel chart-card" style={{ marginTop: '0px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
                                <h2 className="chart-title" style={{ margin: 0 }}>Product Sales Comparison</h2>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <div className="admin-form-field" style={{ margin: 0 }}>
                                        <select
                                            style={{ padding: '0.5rem', paddingRight: '0.2rem', minWidth: '120px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                                            value={reportMonth}
                                            onChange={(e) => setReportMonth(Number(e.target.value))}
                                        >
                                            <option value={1}>January</option>
                                            <option value={2}>February</option>
                                            <option value={3}>March</option>
                                            <option value={4}>April</option>
                                            <option value={5}>May</option>
                                            <option value={6}>June</option>
                                            <option value={7}>July</option>
                                            <option value={8}>August</option>
                                            <option value={9}>September</option>
                                            <option value={10}>October</option>
                                            <option value={11}>November</option>
                                            <option value={12}>December</option>
                                        </select>
                                    </div>
                                    <div className="admin-form-field" style={{ margin: 0 }}>
                                        <select
                                            style={{ padding: '0.5rem', paddingRight: '0.5rem', minWidth: '100px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                                            value={reportYear}
                                            onChange={(e) => setReportYear(Number(e.target.value))}
                                        >
                                            {Array.from({ length: 10 }, (_, i) => getCurrentYear() - i).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {isProductSalesReportLoading ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading product sales data...</div>
                            ) : (
                                <div style={{ width: '100%' }}>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={productSalesReportData || []} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border, #e5e7eb)" />
                                            <XAxis
                                                dataKey="productName"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: 'var(--text-muted, #6b7280)', fontWeight: 500 }}
                                                angle={-25}
                                                textAnchor="end"
                                                dy={10}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                allowDecimals={false}
                                                tick={{ fontSize: 12, fill: 'var(--text-muted, #6b7280)', fontWeight: 500 }}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 'var(--radius-md, 8px)',
                                                    border: '1px solid var(--border, #e5e7eb)',
                                                    backgroundColor: 'var(--surface, #ffffff)',
                                                    color: 'var(--text, #111827)',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                height={40}
                                                iconType="circle"
                                                wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: 'var(--text, #374151)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="currentMonthSales"
                                                name="Current Month"
                                                stroke="#4f46e5"
                                                strokeWidth={3}
                                                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                                dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface, #fff)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="previousMonthSales"
                                                name="Previous Month"
                                                stroke="#9ca3af"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                activeDot={{ r: 4, fill: '#9ca3af', strokeWidth: 0 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="currentYearSales"
                                                name="Current Year"
                                                stroke="#059669"
                                                strokeWidth={3}
                                                activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                                                dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface, #fff)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="previousYearSales"
                                                name="Previous Year"
                                                stroke="#d1d5db"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                activeDot={{ r: 4, fill: '#d1d5db', strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Cost Analytics Chart */}
                        <div className="glass-panel chart-card" style={{ marginTop: '0px' }}>
                            <CostAnalyticsChart />
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default AdminReports;
