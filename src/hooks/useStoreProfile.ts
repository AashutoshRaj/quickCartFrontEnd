import { useQuery, useQueryClient } from '@tanstack/react-query';

interface StoreProfile {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  description?: string;
  currency: string;
  timezone: string;
  logo?: string | null;
  qrCode?: string | null;
  qrGeneratedAt?: string;
  businessHours?: Array<{
    day: string;
    open: boolean;
    from: string;
    to: string;
  }>;
  status?: 'active' | 'inactive' | 'closed';
}

const fetchStoreProfile = async (): Promise<StoreProfile> => {
  const res = await fetch('/api/v1/stores/profile');
  if (res.status === 404) {
    throw new Error('No store profile found');
  }
  if (!res.ok) throw new Error('Failed to fetch store profile');
  const data = await res.json();
  return data.data?.store || data;
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
