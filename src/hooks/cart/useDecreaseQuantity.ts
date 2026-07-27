/**
 * Decrease Quantity Hook
 * Manages decreasing product quantity in cart
 */

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService.ts';
import type { AddToCartResponse } from '../../types/index';

/**
 * Hook to decrease product quantity in cart
 *
 * @returns {UseMutationResult} Mutation result for quantity decrease
 * @returns {AddToCartResponse | undefined} data - Updated cart response
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to decrease quantity (productId string)
 *
 * @remarks
 * - Decreases quantity by 1 for specified product
 * - Invalidates cart query cache on success
 * - Shows error notification if operation fails
 *
 * @example
 * const { mutate: decreaseQty, isPending } = useDecreaseQuantity();
 * decreaseQty('prod_123');
 */
export const useDecreaseQuantity = (): UseMutationResult<
  AddToCartResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.decreaseQuantity(productId),
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
      const message = error?.response?.data?.message || 'Unable to decrease quantity';
      toast.error(message);
    },
  });
};
