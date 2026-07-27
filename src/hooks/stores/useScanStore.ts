/**
 * Scan Store Hook
 * Fetches store information by store ID using React Query
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import apiClient from '../../api/axios.ts';
import type { ScanStoreOptions, ActiveStore } from '../../types/index';

/**
 * Hook to fetch store information by store ID
 *
 * Uses TanStack Query for caching and state management.
 * Only executes query when storeId is provided and non-empty.
 *
 * @param {string} storeId - Store ID to scan/fetch (empty or falsy disables query)
 * @param {ScanStoreOptions} [options] - Additional React Query options
 * @returns {UseQueryResult} Query result with store data
 * @returns {unknown | undefined} data - Store information if found
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if query fails
 *
 * @remarks
 * - Query is enabled only when storeId is non-empty
 * - Results cached for 5 minutes
 * - Garbage collection at 10 minutes
 * - Retries once on failure
 * - Trims storeId before searching
 *
 * @example
 * const { data: store, isLoading } = useScanStore('store_123');
 * if (isLoading) return <div>Loading store...</div>;
 * if (!data) return <div>Store not found</div>;
 * return <div>{data.storeName}</div>;
 */
export const useScanStore = (
  storeId: string,
  options: ScanStoreOptions = {}
): UseQueryResult<ActiveStore | undefined, Error> => {
  return useQuery({
    queryKey: ['store', 'scan', storeId],
    queryFn: async (): Promise<ActiveStore | undefined> => {
      /**
       * Validate store ID input
       */
      if (!storeId || storeId.trim().length === 0) {
        throw new Error('Store ID is required');
      }

      /**
       * Fetch store information
       */
      const response = await apiClient.get(`/stores/scan/${storeId.trim()}`);
      console.log('gettingstoreidinfo', response);

      /**
       * Extract store from response
       * API returns: { status: "success", data: { store: {...} } }
       */
      const apiData = response.data as Record<string, any>;
      const store = apiData?.data?.store as ActiveStore | undefined;
      return store;
    },
    enabled: !!storeId && storeId.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    ...options,
  });
};
