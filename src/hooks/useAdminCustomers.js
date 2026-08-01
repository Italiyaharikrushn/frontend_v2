import { useGetAllMessagesQuery, useReplyToMessageMutation } from '../api/contactApi';
import { useGetCustomersQuery } from '../api/authApi';
import { useGetSellerOrdersQuery } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminCustomers = () => {
  const { pushToast } = useToast();
  const { data: messages = [], isLoading: isLoadingMessages, refetch } = useGetAllMessagesQuery();
  const { data: rawCustomers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const { data: orders = [], isLoading: isLoadingOrders } = useGetSellerOrdersQuery();
  const [replyToMessage] = useReplyToMessageMutation();

  const handleReply = async (id) => {
    const replyText = window.prompt("Enter your reply message:");
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

  const realCustomers = rawCustomers.map(customer => {
    const customerOrders = orders.filter(order => order.customerEmail === customer.email);
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return {
      ...customer,
      orders: totalOrders,
      spent: `₹${totalSpent.toFixed(2)}`
    };
  });

  return { messages, isLoadingMessages, realCustomers, isLoadingCustomers: isLoadingCustomers || isLoadingOrders, handleReply };
};
