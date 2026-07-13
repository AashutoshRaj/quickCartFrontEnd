import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService';

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => cartService.removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to remove item';
      toast.error(message);
    },
  });
};
