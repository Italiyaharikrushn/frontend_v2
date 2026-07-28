import { useGetAllMessagesQuery, useReplyToMessageMutation } from '../api/contactApi';
import { useGetCustomersQuery } from '../api/authApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminCustomers = () => {
  const { pushToast } = useToast();
  const { data: messages = [], isLoading: isLoadingMessages, refetch } = useGetAllMessagesQuery();
  const { data: realCustomers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery();
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

  return { messages, isLoadingMessages, realCustomers, isLoadingCustomers, handleReply };
};
