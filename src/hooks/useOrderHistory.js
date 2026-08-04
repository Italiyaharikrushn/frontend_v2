import { useState } from 'react';
import { useGetCustomerOrdersQuery, useReturnCustomerOrderMutation, useCancelCustomerOrderMutation } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';
import { useAlert } from '../components/ui/AlertProvider';

export const useOrderHistory = () => {
    const { pushToast } = useToast();
    const { confirm } = useAlert();
    const [page, setPage] = useState(0);
    const size = 10;

    const { data = {}, isLoading } = useGetCustomerOrdersQuery({ page, size });
    const orders = data.content || [];
    const totalPages = data.totalPages || 0;

    const [returnOrder] = useReturnCustomerOrderMutation();
    const [cancelOrder] = useCancelCustomerOrderMutation();

    const handleReturn = async (orderId) => {
        if (await confirm('Are you sure you want to return this order?')) {
            try {
                await returnOrder(orderId).unwrap();
                pushToast('Return request submitted successfully', 'success');
            } catch (err) {
                console.error('Failed to submit return request:', err);
                pushToast('Error submitting return request. Please try again.', 'error');
            }
        }
    };

    const handleCancel = async (orderId) => {
        if (await confirm('Are you sure you want to cancel this order?')) {
            try {
                await cancelOrder(orderId).unwrap();
                pushToast('Order cancelled successfully', 'success');
            } catch (err) {
                console.error('Failed to cancel order:', err);
                pushToast('Error cancelling order. Please try again.', 'error');
            }
        }
    };

    return { orders, isLoading, page, setPage, totalPages, handleReturn, handleCancel };
};
