import React, { useState } from 'react';
import { Wallet, Settings, FileText, Calendar, List, Truck } from 'lucide-react';
import MonthlyCostDashboard from '../../components/admin/cost/MonthlyCostDashboard';
import YearlyCostDashboard from '../../components/admin/cost/YearlyCostDashboard';
import DailyPurchaseTab from '../../components/admin/cost/DailyPurchaseTab';
import ShippingCostTab from '../../components/admin/cost/ShippingCostTab';
import DailyCostSummarySection from '../../components/admin/cost/DailyCostSummarySection';
import '../../styles/pages/admin/AdminCostManagement.css';

const AdminCostManagement = () => {
    const [activeTab, setActiveTab] = useState('daily');

    return (
        <div className="admin-cost-management-page">
            <div className="page-header">
                <div>
                    <h1>
                        <Wallet className="w-6 h-6" />
                        Cost Management
                    </h1>
                    <p>Manage cost types and view cost reports.</p>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs-header border-b border-gray-200">
                    <button
                        className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={() => setActiveTab('daily')}
                    >
                        <Calendar className="w-4 h-4" />
                        Daily Costs
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
                        onClick={() => setActiveTab('purchases')}
                    >
                        <List className="w-4 h-4" />
                        Daily Purchases
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shipping')}
                    >
                        <Truck className="w-4 h-4" />
                        Shipping Costs
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monthly')}
                    >
                        <FileText className="w-4 h-4" />
                        Monthly Report
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'yearly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('yearly')}
                    >
                        <Calendar className="w-4 h-4" />
                        Yearly Report
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'daily' && <DailyCostSummarySection />}
                    {activeTab === 'purchases' && <DailyPurchaseTab />}
                    {activeTab === 'shipping' && <ShippingCostTab />}
                    {activeTab === 'monthly' && <MonthlyCostDashboard />}
                    {activeTab === 'yearly' && <YearlyCostDashboard />}
                </div>
            </div>
        </div>
    );
};

export default AdminCostManagement;
