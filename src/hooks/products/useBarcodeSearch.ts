/**
 * Barcode Search Hook
 * Fetches product information by barcode using React Query
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import apiClient from '../../api/axios.ts';
import type { BarcodeSearchOptions, Product } from '../../types/index';

/**
 * Hook to search for products by barcode
 *
 * Uses TanStack Query for caching and state management.
 * Only executes query when barcode is provided and non-empty.
 *
 * @param {string} barcode - Barcode to search for (empty or falsy disables query)
 * @param {string} [storeId] - Store ID for store-scoped product validation
 * @param {BarcodeSearchOptions} [options] - Additional React Query options
 * @returns {UseQueryResult} Query result with product data
 * @returns {Product | undefined} data - Product information if found
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if query fails
 *
 * @remarks
 * - Query is enabled only when barcode is non-empty
 * - Results cached for 5 minutes
 * - Garbage collection at 10 minutes
 * - Retries once on failure
 * - Trims barcode before searching
 * - Validates product belongs to provided storeId
 *
 * @example
 * const { data: product, isLoading } = useBarcodeSearch('1234567890', 'store-123');
 * if (isLoading) return <div>Searching...</div>;
 * if (!data) return <div>Product not found</div>;
 * return <div>{data.name}</div>;
 */
export const useBarcodeSearch = (
  barcode: string,
  storeId?: string,
  options: BarcodeSearchOptions = {}
): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: ['product', 'barcode', barcode, storeId],
    queryFn: async (): Promise<Product> => {
      /**
       * Validate barcode input
       */
      if (!barcode || barcode.trim().length === 0) {
        throw new Error('Barcode is required');
      }

      /**
       * Fetch product by barcode with store ID validation
       */
      const response = await apiClient.get(`/products/barcode/${barcode.trim()}`, {
        params: storeId ? { storeId } : {},
      });

      /**
       * Extract product from response (supports multiple response formats)
       */
      return (response.data?.data?.product || response.data?.product) as Product;
    },
    enabled: !!barcode && barcode.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    ...options,
  });
};
