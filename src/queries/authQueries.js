import { useMutation } from '@tanstack/react-query';
import authService from '../api/services/authService';
import { useDispatch } from 'react-redux';
import { logout, setAuth } from '../store/slices/authSlice';

export const useSendOTP = () => {
  return useMutation({
    mutationFn: (phoneNumber) => authService.sendOTP(phoneNumber),
    onError: (error) => {
      console.error('OTP send error:', error);
    },
  });
};

export const useVerifyOTP = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ phoneNumber, otp }) => authService.verifyOTP({ phoneNumber, otp }),
    onSuccess: (data) => {
      if (data.status === 'success' || data.success) {
        dispatch(setAuth({
          user: data.user || data.data?.user,
          token: data.token,
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
      dispatch(logout());
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
};
