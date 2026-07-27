/**
 * Clear Cart Hook
 * Manages clearing all items from shopping cart
 */

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService.ts';
import type { AddToCartResponse } from '../../types/index';

/**
 * Hook to clear all items from cart
 *
 * @returns {UseMutationResult} Mutation result for clearing cart
 * @returns {void} data - Response from server
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to clear the cart
 *
 * @remarks
 * - Invalidates cart query cache on success
 * - Shows error notification if clearing fails
 * - No success toast to avoid interruption (cart becomes empty silently)
 *
 * @example
 * const { mutate: clearCart, isPending } = useClearCart();
 * clearCart();
 */
export const useClearCart = (): UseMutationResult<
  AddToCartResponse,
  Error,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
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
      const message = error?.response?.data?.message || 'Unable to clear cart';
      toast.error(message);
    },
  });
};
