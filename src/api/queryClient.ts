/**
 * React Query Client Configuration
 * Creates and exports a configured QueryClient for data management
 */

import { QueryClient } from '@tanstack/react-query';
import type { QueryClientInstance } from '../types/index';

/**
 * Create and configure QueryClient with default options
 * @remarks
 * - Retry failed queries once before giving up
 * - Disable refetch when window regains focus
 * - Set stale time to 5 minutes to reduce unnecessary refetches
 */
const queryClient: QueryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default queryClient;
