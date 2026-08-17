import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../api/productApi';
import { useGetSellerOrdersQuery } from '../api/orderApi';

export const useDashboardHome = () => {
    const { data: productsData = {}, isLoading: isLoadingProducts } = useGetProductsQuery();
    const { data: ordersData = {}, isLoading: isLoadingOrders } = useGetSellerOrdersQuery();

    const products = Array.isArray(productsData) ? productsData : (productsData.content || []);
    const orders = Array.isArray(ordersData) ? ordersData : (ordersData.content || []);
    const navigate = useNavigate();

    const stats = useMemo(() => {
        const activeProducts = products.length; // Assuming all returned are active for now
        const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
        const returnedOrders = orders.filter(o => o.status === 'RETURNED').length;
        const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const productValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const todaySales = orders.reduce((sum, o) => {
            const orderDate = new Date(o.orderDate || o.createdAt).getTime();
            if (orderDate >= todayStart) {
                return sum + (o.totalAmount || o.amount || 0);
            }
            return sum;
        }, 0);

        const orderStatusCounts = orders.reduce((acc, o) => {
            const status = o.status || 'UNKNOWN';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const orderStatusData = Object.keys(orderStatusCounts).map(key => ({
            name: key,
            value: orderStatusCounts[key]
        }));

        return {
            activeProducts,
            pendingOrders,
            returnedOrders,
            totalSales,
            productValue,
            todaySales,
            orderStatusData
        };
    }, [products, orders]);

    const isLoading = isLoadingProducts || isLoadingOrders;

    return { stats, isLoading, navigate };
};
