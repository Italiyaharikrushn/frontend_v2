import { useGetAllReturnRequestsQuery, useUpdateReturnStatusMutation } from '../api/returnApi';
import { useToast } from './useToast';
import { useNavigate } from 'react-router-dom';

export const useAdminReturns = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { data: requestsData, isLoading } = useGetAllReturnRequestsQuery();
  const [updateReturnStatus, { isLoading: isUpdating }] = useUpdateReturnStatusMutation();

  const requests = requestsData || [];

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReturnStatus({
        id,
        statusData: { status, adminComments: `Return ${status.toLowerCase()} by admin` }
      }).unwrap();
      pushToast(`Return request ${status.toLowerCase()} successfully.`, status === 'APPROVED' ? 'success' : 'error');
    } catch (error) {
      console.error('Failed to update return status', error);
      pushToast('Failed to update return request status.', 'error');
    }
  };

  return {
    requests,
    isLoading,
    isUpdating,
    handleUpdateStatus,
    navigate
  };
};
