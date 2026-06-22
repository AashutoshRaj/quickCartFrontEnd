import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axios';

/**
 * Custom hook for searching products by barcode
 * Uses TanStack Query for caching and state management
 * @param {string} barcode - The barcode to search for
 * @param {Object} options - Additional react-query options
 * @returns {Object} - Query result with data, loading, and error states
 */
export const useBarcodeSearch = (barcode, options = {}) => {
  return useQuery({
    queryKey: ['product', 'barcode', barcode],
    queryFn: async () => {
      if (!barcode || barcode.trim().length === 0) {
        throw new Error('Barcode is required');
      }

      const response = await apiClient.get(`/products/barcode/${barcode.trim()}`);
      return response.data?.data?.product || response.data?.product;
    },
    enabled: !!barcode && barcode.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    ...options,
  });
};
