import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService';

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to clear cart';
      toast.error(message);
    },
  });
};
