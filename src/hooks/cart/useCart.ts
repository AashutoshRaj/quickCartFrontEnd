/**
 * Get Cart Hook
 * Fetches the current shopping cart contents
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import cartService from '../../api/services/cartService.ts';
import type { GetCartResponse } from '../../types/index';

/**
 * Hook to fetch and manage shopping cart data
 *
 * @returns {UseQueryResult} Query result for cart data
 * @returns {GetCartResponse | undefined} data - Cart contents and totals
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if query fails
 *
 * @remarks
 * - No staleTime means data is always considered stale
 * - Refetches when window regains focus
 * - Useful for keeping cart in sync with server
 *
 * @example
 * const { data: cart, isLoading } = useCart();
 * const items = cart?.data?.items || [];
 */
export const useCart = (): UseQueryResult<GetCartResponse, Error> => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 0, // Always consider stale
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};
