import { useGetAllMessagesQuery, useReplyToMessageMutation } from '../api/contactApi';
import { useGetCustomersQuery } from '../api/authApi';
import { useGetSellerOrdersQuery } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';
import { useAlert } from '../components/ui/AlertProvider';

export const useAdminCustomers = () => {
  const { pushToast } = useToast();
  const { data: messages = [], isLoading: isLoadingMessages, refetch } = useGetAllMessagesQuery();
  const { data: rawCustomers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const { data: orders = [], isLoading: isLoadingOrders } = useGetSellerOrdersQuery();
  const [replyToMessage] = useReplyToMessageMutation();
  const { prompt } = useAlert();

  const handleReply = async (id) => {
    const replyText = await prompt("Enter your reply message:");
    if (replyText) {
      try {
        await replyToMessage({ id, replyText }).unwrap();
        pushToast('Reply sent successfully!', 'success');
      } catch (err) {
        console.error('Failed to send reply:', err);
        pushToast('Failed to send reply.', 'error');
      }
    }
  };

  const customersList = Array.isArray(rawCustomers) ? rawCustomers : (rawCustomers?.content || []);
  const ordersList = Array.isArray(orders) ? orders : (orders?.content || []);

  const realCustomers = customersList.map(customer => {
    const customerOrders = ordersList.filter(order => order?.customerEmail === customer?.email || order?.buyer?.email === customer?.email);
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
    return {
      ...customer,
      orders: totalOrders,
      spent: `₹${totalSpent.toFixed(2)}`
    };
  });

  return { messages, isLoadingMessages, realCustomers, isLoadingCustomers: isLoadingCustomers || isLoadingOrders, handleReply };
};
