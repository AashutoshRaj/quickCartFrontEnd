import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService';

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCart({ productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to update cart';
      toast.error(message);
    },
  });
};
