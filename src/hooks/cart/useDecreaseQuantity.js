import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService';

export const useDecreaseQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => cartService.decreaseQuantity(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to decrease quantity';
      toast.error(message);
    },
  });
};
