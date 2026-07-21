import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { AUTH_TOKEN_KEY } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  storeName: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: AuthUser;
  };
}

export interface SignupPayload {
  name: string;
  email: string;
  storeName: string;
  password?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

// 1. Fetch current user query
export function useMeQuery(token: string | null) {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<AuthUser> => {
      const response = await api.get<{ success: boolean; data: { user: AuthUser } }>("/auth/me");
      return response.data.data.user;
    },
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes cache freshness
  });
}

// 2. Login mutation hook
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Save token in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      // Pre-populate 'me' query data with the returned user to avoid extra roundtrip
      queryClient.setQueryData(["me"], data.data.user);
    },
  });
}

// 3. Signup mutation hook
export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SignupPayload): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/auth/signup", payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Save token in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      // Pre-populate 'me' query data
      queryClient.setQueryData(["me"], data.data.user);
    },
  });
}
