/**
 * Add to Cart Hook
 * Manages adding products to shopping cart
 */

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService.ts';
import type { AddToCartParams, AddToCartResponse } from '../../types/index';

/**
 * Hook to add products to cart
 *
 * @returns {UseMutationResult} Mutation result for adding to cart
 * @returns {void} data - Response from server
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to add item to cart
 *
 * @remarks
 * - Invalidates cart query cache on success
 * - Automatically shows success/error toast notifications
 * - Updates cart data in React Query cache
 * - Handles API error responses gracefully
 *
 * @example
 * const { mutate: addToCart, isPending } = useAddToCart();
 * addToCart({
 *   productId: 'prod_123',
 *   quantity: 2
 * });
 */
export const useAddToCart = (): UseMutationResult<
  AddToCartResponse,
  Error,
  AddToCartParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity = 1, storeId }: AddToCartParams) =>
      cartService.addToCart({ productId, quantity, storeId }),
    onSuccess: (data: AddToCartResponse & Record<string, unknown>) => {
      /**
       * Invalidate cart query to trigger refetch
       */
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      /**
       * Update cache with new cart data if available
       */
      const cart = (data as Record<string, unknown>)?.data?.cart;
      if (cart) {
        queryClient.setQueryData(['cart'], { data: { cart } });
      }

      /**
       * Show success notification
       */
      toast.success('Added to cart successfully');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      /**
       * Extract error message from response or use default
       */
      const message = error?.response?.data?.message || 'Unable to add the item to cart';
      toast.error(message);
    },
  });
};
