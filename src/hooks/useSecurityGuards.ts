import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSecurityGuards,
  getSecurityGuardStats,
  createSecurityGuard,
  updateSecurityGuard,
  toggleSecurityGuardStatus,
  resetSecurityGuardPassword,
  deleteSecurityGuard,
  sendSecurityGuardCredentials,
  type SecurityGuardListFilters,
  type CreateSecurityGuardPayload,
} from '../api/securityGuardApi';

const GUARDS_KEY = ['securityGuards'];
const STATS_KEY = ['securityGuardStats'];

export function useSecurityGuards(filters: SecurityGuardListFilters) {
  return useQuery({
    queryKey: [...GUARDS_KEY, filters],
    queryFn: () => getSecurityGuards(filters),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useSecurityGuardStats() {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: getSecurityGuardStats,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

function useInvalidateGuards() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: GUARDS_KEY });
    queryClient.invalidateQueries({ queryKey: STATS_KEY });
  };
}

export function useCreateSecurityGuard() {
  const invalidate = useInvalidateGuards();
  return useMutation({
    mutationFn: (payload: CreateSecurityGuardPayload) => createSecurityGuard(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateSecurityGuard() {
  const invalidate = useInvalidateGuards();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateSecurityGuardPayload> }) =>
      updateSecurityGuard(id, payload),
    onSuccess: invalidate,
  });
}

export function useToggleSecurityGuardStatus() {
  const invalidate = useInvalidateGuards();
  return useMutation({
    mutationFn: (id: string) => toggleSecurityGuardStatus(id),
    onSuccess: invalidate,
  });
}

export function useResetSecurityGuardPassword() {
  return useMutation({
    mutationFn: (id: string) => resetSecurityGuardPassword(id),
  });
}

export function useDeleteSecurityGuard() {
  const invalidate = useInvalidateGuards();
  return useMutation({
    mutationFn: (id: string) => deleteSecurityGuard(id),
    onSuccess: invalidate,
  });
}

export function useSendSecurityGuardCredentials() {
  return useMutation({
    mutationFn: ({ id, method, tempPassword }: { id: string; method: 'email' | 'sms'; tempPassword: string }) =>
      sendSecurityGuardCredentials(id, method, tempPassword),
  });
}
