/**
 * Authentication Queries
 * React Query hooks for authentication operations
 */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import authService from '../api/services/authService.ts';
import { logout, setAuth } from '../store/slices/authSlice.ts';
import type {
  CheckPhoneResponse,
  SendOTPResponse,
  VerifyOTPResponse,
  CompleteRegistrationResponse,
  ApiSuccessResponse,
} from '../types/index';

/**
 * Hook to check if a phone number exists in the system
 *
 * @returns {UseMutationResult} Mutation result with phone check functionality
 * @returns {void} data - Response from server
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if query fails
 * @returns {Function} mutate - Function to trigger phone check
 *
 * @example
 * const { mutate: checkPhone, isLoading } = useCheckPhone();
 * checkPhone('+919876543210');
 */
export const useCheckPhone = (): UseMutationResult<
  CheckPhoneResponse,
  Error,
  string
> => {
  return useMutation({
    mutationFn: (phoneNumber: string) => authService.checkPhone(phoneNumber),
    onError: (error: Error) => {
      console.error('Phone check error:', error);
    },
  });
};

/**
 * Hook to send OTP to a phone number
 *
 * @returns {UseMutationResult} Mutation result with OTP sending functionality
 * @returns {void} data - Response from server
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to trigger OTP sending
 *
 * @example
 * const { mutate: sendOTP, isLoading } = useSendOTP();
 * sendOTP('+919876543210');
 */
export const useSendOTP = (): UseMutationResult<
  SendOTPResponse,
  Error,
  string
> => {
  return useMutation({
    mutationFn: (phoneNumber: string) => authService.sendOTP(phoneNumber),
    onError: (error: Error) => {
      console.error('OTP send error:', error);
    },
  });
};

/**
 * Hook to verify OTP code
 *
 * @returns {UseMutationResult} Mutation result with OTP verification
 * @returns {VerifyOTPResponse} data - Response with token or user data
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to verify OTP
 *
 * @remarks
 * - Automatically dispatches setAuth action on success
 * - Updates Redux store with user and token data
 * - Supports both status='success' and success=true response formats
 *
 * @example
 * const { mutate: verifyOTP, isLoading } = useVerifyOTP();
 * verifyOTP({
 *   phoneNumber: '+919876543210',
 *   otp: '123456'
 * });
 */
export const useVerifyOTP = (): UseMutationResult<
  VerifyOTPResponse,
  Error,
  { phoneNumber: string; otp: string }
> => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      authService.verifyOTP({ phoneNumber, otp }),
    onSuccess: (data: VerifyOTPResponse & Record<string, unknown>) => {
      if ((data.status === 'success' || (data as Record<string, unknown>).success) && (data as Record<string, unknown>).token) {
        dispatch(setAuth({
          user: (data as Record<string, unknown>).user || (data as Record<string, unknown>).data?.user,
          token: (data as Record<string, unknown>).token as string,
        }));
      }
    },
    onError: (error: Error) => {
      console.error('OTP verification error:', error);
    },
  });
};

/**
 * Hook to complete user registration
 *
 * @returns {UseMutationResult} Mutation result with registration completion
 * @returns {CompleteRegistrationResponse} data - Registration response
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to complete registration
 *
 * @remarks
 * - Automatically dispatches setAuth action on success
 * - Updates Redux store with user and token data
 * - Finalizes user account creation
 *
 * @example
 * const { mutate: completeReg } = useCompleteRegistration();
 * completeReg({
 *   name: 'John Doe',
 *   registrationToken: 'token_from_verify_otp'
 * });
 */
export const useCompleteRegistration = (): UseMutationResult<
  CompleteRegistrationResponse & Record<string, unknown>,
  Error,
  { name: string; registrationToken: string }
> => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({
      name,
      registrationToken,
    }: {
      name: string;
      registrationToken: string;
    }) =>
      authService.completeRegistration({ name, registrationToken }),
    onSuccess: (data: CompleteRegistrationResponse & Record<string, unknown>) => {
      if ((data.status === 'success' || data.success) && data.token) {
        dispatch(setAuth({
          user: data.user || data.data?.user,
          token: data.token as string,
        }));
      }
    },
    onError: (error: Error) => {
      console.error('Registration completion error:', error);
    },
  });
};

/**
 * Hook to logout user
 *
 * @returns {UseMutationResult} Mutation result with logout functionality
 * @returns {ApiSuccessResponse} data - Logout confirmation
 * @returns {boolean} isLoading - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to trigger logout
 *
 * @remarks
 * - Automatically dispatches logout action on success
 * - Clears Redux store of user data
 * - Removes tokens from localStorage
 * - Called by multiple components when user signs out
 *
 * @example
 * const { mutate: logoutUser, isLoading } = useLogout();
 * logoutUser();
 */
export const useLogout = (): UseMutationResult<
  ApiSuccessResponse,
  Error,
  void
> => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      /**
       * Clear user data from Redux and localStorage
       */
      dispatch(logout());
    },
    onError: (error: Error) => {
      console.error('Logout error:', error);
    },
  });
};
