import { useState, useMemo } from 'react';
import { useGetSellerAnalyticsQuery, useGetSellerOrdersQuery, useGetProductSalesReportQuery } from '../api/orderApi';
import { useGetProductsQuery } from '../api/productApi';
import { useGetCustomersQuery } from '../api/authApi';

export const useAdminReports = () => {
    const [days, setDays] = useState(30);
    const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
    const [reportYear, setReportYear] = useState(new Date().getFullYear());

    const { data: analyticsData = [], isLoading: isAnalyticsLoading, isError: isAnalyticsError, refetch } = useGetSellerAnalyticsQuery(days);
    const { data: productsData = [], isLoading: isProductsLoading } = useGetProductsQuery();
    const { data: customersData = [], isLoading: isCustomersLoading } = useGetCustomersQuery();
    const { data: ordersData = [], isLoading: isOrdersLoading } = useGetSellerOrdersQuery();

    const { data: productSalesReportData = [], isLoading: isProductSalesReportLoading } = useGetProductSalesReportQuery(
        { month: reportMonth, year: reportYear },
        { skip: !reportYear }
    );

    const products = Array.isArray(productsData) ? productsData : (productsData?.content || []);
    const customers = Array.isArray(customersData) ? customersData : (customersData?.content || []);
    const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.content || []);

    const isLoading = isAnalyticsLoading || isProductsLoading || isCustomersLoading || isOrdersLoading;
    const isError = isAnalyticsError;

    // 1. Sales Data
    const salesData = analyticsData.map(item => ({
        date: item.date,
        orders: item.totalOrders,
        payment: item.totalPayment,
    }));

    // 2. Inventory Health
    const inventoryData = useMemo(() => {
        let inStock = 0;
        let lowStock = 0;
        let outOfStock = 0;
        products.forEach(p => {
            if (p.stock > 10) inStock++;
            else if (p.stock > 0) lowStock++;
            else outOfStock++;
        });
        return [
            { name: 'In Stock', value: inStock, fill: '#10b981' },
            { name: 'Low Stock', value: lowStock, fill: '#f59e0b' },
            { name: 'Out of Stock', value: outOfStock, fill: '#ef4444' }
        ].filter(item => item.value > 0);
    }, [products]);

    // 3. Customer Registrations (Last 6 Months)
    const customerGrowthData = useMemo(() => {
        const counts = {};
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = d.toLocaleString('default', { month: 'short' });
            counts[monthStr] = 0;
            months.push(monthStr);
        }

        customers.forEach(c => {
            if (!c.createdAt) return;
            const d = new Date(c.createdAt);
            const monthStr = d.toLocaleString('default', { month: 'short' });
            if (counts[monthStr] !== undefined) {
                counts[monthStr]++;
            }
        });

        return months.map(m => ({ month: m, users: counts[m] }));
    }, [customers]);

    // 4. Sales Target (Radial Progress)
    const targetData = useMemo(() => {
        const currentMonthSales = salesData.reduce((sum, item) => sum + item.payment, 0); // Approx based on selected 'days'
        const target = 100000; // Hardcoded ₹1,00,000 monthly target for demo
        const percentage = Math.min(100, Math.round((currentMonthSales / target) * 100));
        return {
            sales: currentMonthSales,
            target,
            percentage,
            radialData: [{ name: 'Progress', value: percentage, fill: 'var(--primary)' }]
        };
    }, [salesData]);

    // 5. Product Performance (Views vs Sales)
    const productPerformanceData = useMemo(() => {
        const productSales = {};
        orders.forEach(order => {
            if (order.orderItems) {
                order.orderItems.forEach(item => {
                    if (item.product && item.product.id) {
                        productSales[item.product.id] = (productSales[item.product.id] || 0) + item.quantity;
                    }
                });
            }
        });

        const performance = products.map(p => ({
            name: p.title?.substring(0, 15) + '...',
            views: p.views || 0,
            sales: productSales[p.id] || 0
        }));

        // Sort by sales descending and take top 5
        return performance.sort((a, b) => b.sales - a.sales).slice(0, 5);
    }, [products, orders]);

    return {
        products,
        salesData,
        inventoryData,
        customerGrowthData,
        targetData,
        productPerformanceData,
        productSalesReportData,
        isProductSalesReportLoading,
        reportMonth, setReportMonth,
        reportYear, setReportYear,
        days,
        setDays,
        isLoading,
        isError,
        refetch
    };
};
