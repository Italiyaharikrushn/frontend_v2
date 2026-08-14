import { toast } from 'react-toastify';

export const useToast = () => {
  return {
    pushToast: (message, type = 'info') => {
      // react-toastify has specific methods for success, error, warning, info
      if (toast[type]) {
        toast[type](message);
      } else {
        toast(message);
      }
    }
  };
};

export default useToast;
