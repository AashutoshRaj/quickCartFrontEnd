import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axios';

export const useScanStore = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['store', 'scan', storeId],
    queryFn: async () => {
      if (!storeId || storeId.trim().length === 0) {
        throw new Error('Store ID is required');
      }

      const response = await apiClient.get(`/stores/scan/${storeId.trim()}`);
      console.log("gettingstoreidinfo", response)
      return response.data?.data?.store || response.data?.store;
    },
    enabled: !!storeId && storeId.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    ...options,
  });
};
