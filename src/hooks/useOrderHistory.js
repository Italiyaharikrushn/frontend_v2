import { useState } from 'react';
import { useGetCustomerOrdersQuery, useCancelCustomerOrderMutation } from '../api/orderApi';
import { useCreateReturnRequestMutation } from '../api/returnApi';
import { useGetStorePolicyQuery } from '../api/policyApi';
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

    const { data: storePolicy } = useGetStorePolicyQuery();

    const isOrderCancellable = (order) => {
        if (!storePolicy) return false;
        if (storePolicy.isCancellationAccepted === false) return false;
        if (order.status !== 'PENDING' && order.status !== 'READY_TO_SHIP') return false;

        const window = storePolicy.cancellationWindow;
        if (window === 'No cancellations') return false;

        let maxMinutes = 15;
        if (window === '15 minutes') maxMinutes = 15;
        else if (window === '30 minutes') maxMinutes = 30;
        else if (window === '1 hour') maxMinutes = 60;
        else if (window === '12 hours') maxMinutes = 12 * 60;
        else if (window === '24 hours') maxMinutes = 24 * 60;

        const orderDate = new Date(order.orderDate);
        const now = new Date();
        const diffMinutes = (now - orderDate) / (1000 * 60);

        return diffMinutes <= maxMinutes;
    };

    const getCancellationDeadline = (order) => {
        if (!storePolicy || storePolicy.isCancellationAccepted === false) return null;
        if (order.status !== 'PENDING' && order.status !== 'READY_TO_SHIP') return null;

        const window = storePolicy.cancellationWindow;
        if (window === 'No cancellations') return null;

        let maxMinutes = 15;
        if (window === '15 minutes') maxMinutes = 15;
        else if (window === '30 minutes') maxMinutes = 30;
        else if (window === '1 hour') maxMinutes = 60;
        else if (window === '12 hours') maxMinutes = 12 * 60;
        else if (window === '24 hours') maxMinutes = 24 * 60;

        return new Date(new Date(order.orderDate).getTime() + maxMinutes * 60000);
    };

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [returnReason, setReturnReason] = useState('Changed my mind');
    const [returnDetails, setReturnDetails] = useState('');

    const [cancelOrder] = useCancelCustomerOrderMutation();
    const [createReturnRequest] = useCreateReturnRequestMutation();

    const openReturnModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsReturnModalOpen(true);
    };

    const closeReturnModal = () => {
        setSelectedOrderId(null);
        setIsReturnModalOpen(false);
        setReturnReason('Changed my mind');
        setReturnDetails('');
    };

    const submitReturn = async () => {
        if (!selectedOrderId) return;
        try {
            await createReturnRequest({
                orderId: selectedOrderId,
                reason: returnReason,
                details: returnDetails
            }).unwrap();
            pushToast('Return request submitted successfully', 'success');
            closeReturnModal();
            // Ideally we'd refetch orders here, or reload
            window.location.reload();
        } catch (err) {
            console.error('Failed to submit return request:', err);
            pushToast('Error submitting return request. Please try again.', 'error');
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

    return {
        orders, isLoading, page, setPage, totalPages,
        handleCancel, openReturnModal, closeReturnModal, submitReturn,
        isReturnModalOpen, returnReason, setReturnReason, returnDetails, setReturnDetails,
        isOrderCancellable, getCancellationDeadline
    };
};
