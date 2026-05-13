import { useMutation } from '@tanstack/react-query';
import authService from '../api/services/authService';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';

/**
 * Hook to send OTP to phone number
 * Returns confirmationResult which must be used for verification
 */
export const useSendOTP = () => {
  return useMutation({
    mutationFn: (phoneNumber) => authService.sendOTP(phoneNumber),
    onError: (error) => {
      console.error('OTP send error:', error);
    },
  });
};

/**
 * Hook to verify OTP code
 * Updates Redux store with user and token on success
 */
export const useVerifyOTP = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (accessToken) => authService.verifyOTP(accessToken),
    onSuccess: (data) => {
      if (data.status === 'success') {
        // Store user data and token in Redux and localStorage
        dispatch(setAuth({
          user: data.data.user,
          token: data.token,
          firebaseUser: data.firebaseUser,
        }));
      }
    },
    onError: (error) => {
      console.error('OTP verification error:', error);
    },
  });
};

/**
 * Hook to logout user
 * Clears Redux store and local storage
 */
export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear user data from Redux and localStorage
      dispatch({ type: 'auth/logout' });
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
};
