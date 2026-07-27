import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  setEmployeeStatus,
  resetEmployeePassword,
  deleteEmployee,
  sendEmployeeCredentials,
  type EmployeeListFilters,
  type CreateEmployeePayload,
  type EmployeeStatus,
} from '../api/employeeApi';

const EMPLOYEES_KEY = ['employees'];

export function useEmployees(filters: EmployeeListFilters) {
  return useQuery({
    queryKey: [...EMPLOYEES_KEY, filters],
    queryFn: () => getEmployees(filters),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

function useInvalidateEmployees() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
}

export function useCreateEmployee() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateEmployee() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateEmployeePayload> }) =>
      updateEmployee(id, payload),
    onSuccess: invalidate,
  });
}

export function useSetEmployeeStatus() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EmployeeStatus }) => setEmployeeStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useResetEmployeePassword() {
  return useMutation({
    mutationFn: (id: string) => resetEmployeePassword(id),
  });
}

export function useDeleteEmployee() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: invalidate,
  });
}

export function useSendEmployeeCredentials() {
  return useMutation({
    mutationFn: ({ id, method, tempPassword }: { id: string; method: 'email' | 'sms'; tempPassword: string }) =>
      sendEmployeeCredentials(id, method, tempPassword),
  });
}
