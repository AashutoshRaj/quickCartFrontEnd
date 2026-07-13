import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity = 1, storeId }) =>
      cartService.addToCart({ productId, quantity, storeId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      const cart = data?.data?.cart;
      if (cart) {
        queryClient.setQueryData(['cart'], { data: { cart } });
      }
      toast.success('Added to cart successfully');
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to add the item to cart';
      toast.error(message);
    },
  });
};
