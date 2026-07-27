/**
 * Orders Queries
 * React Query hooks for order operations
 */

import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import ordersService from '../api/services/ordersService.ts';
import type { GetOrdersParams, OrdersListResult, OrderDetails } from '../types/index';

/**
 * Hook to fetch all orders for the authenticated user
 *
 * @param {Object} [params] - Query parameters for filtering/pagination
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.limit] - Items per page
 * @param {string} [params.status] - Filter by order status
 * @returns {UseQueryResult} Query result with orders data
 * @returns {OrdersListResult | undefined} data - Orders for the page plus total page count
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if query fails
 *
 * @remarks
 * - Caches results for 5 minutes
 * - Does not refetch when window regains focus
 * - Re-fetches when params change
 *
 * @example
 * const { data: orders, isLoading } = useOrders({ page: 1, limit: 10 });
 */
export const useOrders = (
  params: GetOrdersParams = {}
): UseQueryResult<OrdersListResult, Error> => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersService.getOrders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch details for a specific order
 *
 * @param {string} orderId - Order ID to fetch details for
 * @returns {UseQueryResult} Query result with order details
 * @returns {Object | undefined} data - Order details object
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if query fails
 *
 * @remarks
 * - Only enabled when orderId is provided (truthy)
 * - Caches results for 10 minutes
 * - Useful for order detail pages
 *
 * @example
 * const { data: order, isLoading } = useOrderDetails('order_123');
 */
export const useOrderDetails = (
  orderId: string
): UseQueryResult<OrderDetails, Error> => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to download invoice for an order
 *
 * @returns {UseMutationResult} Mutation result with invoice download
 * @returns {Blob | undefined} data - PDF invoice as blob
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to trigger invoice download
 *
 * @remarks
 * - Automatically creates download link on success
 * - Triggers browser download dialog
 * - Cleans up object URL after download
 * - File is named as `invoice-{orderId}.pdf`
 *
 * @example
 * const { mutate: downloadInvoice, isLoading } = useDownloadInvoice();
 * downloadInvoice('order_123');
 */
export const useDownloadInvoice = (): UseMutationResult<
  Blob,
  Error,
  string
> => {
  return useMutation({
    mutationFn: (orderId: string) => ordersService.downloadInvoice(orderId),
    onSuccess: (data: Blob, orderId: string) => {
      /**
       * Create download link and trigger browser download
       */
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      /**
       * Cleanup: remove link and revoke object URL
       */
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: Error) => {
      console.error('Invoice download error:', error);
    },
  });
};
