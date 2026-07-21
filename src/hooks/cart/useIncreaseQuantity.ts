/**
 * Increase Quantity Hook
 * Manages increasing product quantity in cart
 */

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService.ts';
import type { AddToCartResponse } from '../../types/index';

/**
 * Hook to increase product quantity in cart
 *
 * @returns {UseMutationResult} Mutation result for quantity increase
 * @returns {AddToCartResponse | undefined} data - Updated cart response
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to increase quantity (productId string)
 *
 * @remarks
 * - Increases quantity by 1 for specified product
 * - Invalidates cart query cache on success
 * - Shows error notification if operation fails
 *
 * @example
 * const { mutate: increaseQty, isPending } = useIncreaseQuantity();
 * increaseQty('prod_123');
 */
export const useIncreaseQuantity = (): UseMutationResult<
  AddToCartResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.increaseQuantity(productId),
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
      const message = error?.response?.data?.message || 'Unable to increase quantity';
      toast.error(message);
    },
  });
};
