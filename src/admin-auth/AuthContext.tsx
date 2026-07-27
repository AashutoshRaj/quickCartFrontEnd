import { createContext, type ReactNode, useContext, useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_TOKEN_KEY } from './api';
import {
  useMeQuery,
  useLoginMutation,
  useSignupMutation,
  type AuthUser,
  type SignupPayload,
  type LoginPayload
} from './authHooks';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (payload: SignupPayload) => Promise<any>;
  login: (payload: LoginPayload) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // Initialize token state from localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  });

  // Query for fetching current user profile
  const { 
    data: meUser, 
    isLoading: isMeLoading, 
    isError 
  } = useMeQuery(token);

  // Mutations for login and signup
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  // If fetching current user failed (e.g. token expired), clear session
  useEffect(() => {
    if (isError) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      queryClient.setQueryData(['me'], null);
    }
  }, [isError, queryClient]);

  // Login handler
  const login = async (payload: LoginPayload) => {
    const result = await loginMutation.mutateAsync(payload);
    setToken(result.token);
    return result;
  };

  // Signup handler
  const signup = async (payload: SignupPayload) => {
    const result = await signupMutation.mutateAsync(payload);
    setToken(result.token);
    return result;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    queryClient.setQueryData(['me'], null);
    queryClient.clear(); // Clear all query caches on logout
  };

  // Context value derivation
  const value = useMemo<AuthContextValue>(() => {
    const user = token ? meUser || null : null;
    const isAuthenticated = Boolean(token && user);
    
    // isLoading is true if a token exists and we are fetching user details
    const isLoading = Boolean(token && isMeLoading);

    return {
      user,
      isAuthenticated,
      isLoading,
      signup,
      login,
      logout
    };
  }, [token, meUser, isMeLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
