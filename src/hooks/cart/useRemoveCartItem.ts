/**
 * Remove Cart Item Hook
 * Manages removing products from shopping cart
 */

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService.ts';
import type { AddToCartResponse } from '../../types/index';

/**
 * Hook to remove product from cart
 *
 * @returns {UseMutationResult} Mutation result for item removal
 * @returns {AddToCartResponse | undefined} data - Updated cart response
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to remove item (productId string)
 *
 * @remarks
 * - Completely removes item from cart
 * - Invalidates cart query cache on success
 * - Shows error notification if operation fails
 *
 * @example
 * const { mutate: removeItem, isPending } = useRemoveCartItem();
 * removeItem('prod_123');
 */
export const useRemoveCartItem = (): UseMutationResult<
  AddToCartResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeCartItem(productId),
    onSuccess: () => {
      /**
       * Invalidate cart query to trigger refetch
       */
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      /**
       * Extract error message and show notification
       */
      const message = error?.response?.data?.message || 'Unable to remove item';
      toast.error(message);
    },
  });
};
