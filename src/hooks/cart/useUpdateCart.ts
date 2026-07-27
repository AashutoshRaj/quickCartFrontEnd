/**
 * Update Cart Hook
 * Manages updating product quantity in cart
 */

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import cartService from '../../api/services/cartService.ts';
import type { AddToCartResponse, UpdateCartParams } from '../../types/index';

/**
 * Hook to update product quantity in cart
 *
 * @returns {UseMutationResult} Mutation result for cart update
 * @returns {AddToCartResponse | undefined} data - Updated cart response
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to update cart item
 *
 * @remarks
 * - Updates quantity to specified value (not incremental)
 * - Invalidates cart query cache on success
 * - Shows error notification if operation fails
 *
 * @example
 * const { mutate: updateCart } = useUpdateCart();
 * updateCart({
 *   productId: 'prod_123',
 *   quantity: 5
 * });
 */
export const useUpdateCart = (): UseMutationResult<
  AddToCartResponse,
  Error,
  UpdateCartParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: UpdateCartParams) =>
      cartService.updateCart({ productId, quantity }),
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
      const message = error?.response?.data?.message || 'Unable to update cart';
      toast.error(message);
    },
  });
};
