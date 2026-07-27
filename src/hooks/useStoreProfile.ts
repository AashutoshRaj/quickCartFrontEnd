import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStoreProfile, type StoreData } from '../api/storeApi';

type StoreProfile = StoreData;

const fetchStoreProfile = async (): Promise<StoreProfile> => {
  const result = await getStoreProfile();
  return result.store;
};

export function useStoreProfile() {
  return useQuery({
    queryKey: ['storeProfile'],
    queryFn: fetchStoreProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Hook to invalidate store profile cache (call after updating store)
export function useInvalidateStoreProfile() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['storeProfile'] });
  };
}
