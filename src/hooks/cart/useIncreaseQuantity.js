import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService';

export const useIncreaseQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => cartService.increaseQuantity(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to increase quantity';
      toast.error(message);
    },
  });
};
