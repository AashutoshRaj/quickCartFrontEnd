import apiClient from '../axios';
import {
  sendOTPToPhone,
  verifyOTPCode,
  getCurrentUser,
  getUserToken,
  signOutUser,
} from '../../utils/firebaseAuth';
import { initRecaptchaWidget, getRecaptchaVerifier, clearRecaptchaWidget } from '../../utils/recaptchaWidget';

/**
 * Authentication Service
 * Handles Firebase phone authentication and user management
 */
const authService = {
  /**
   * Initialize reCAPTCHA for phone authentication
   * Must be called before sendOTP
   */
  initRecaptcha: (containerId = 'recaptcha-container') => {
    return initRecaptchaWidget(containerId);
  },

  /**
   * Send OTP to phone number
   * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
   * @returns {Promise<Object>} - Confirmation result to use for OTP verification
   */
  sendOTP: async (phoneNumber) => {
    try {
      const recaptchaVerifier = getRecaptchaVerifier();
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized. Please initialize first.');
      }

      const confirmationResult = await sendOTPToPhone(phoneNumber, recaptchaVerifier);

      return {
        status: 'success',
        message: 'OTP sent successfully',
        confirmationResult,
      };
    } catch (error) {
      console.error('Error in sendOTP:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to send OTP',
        error,
      };
    }
  },

  /**
   * Verify OTP entered by user
   * @param {Object} confirmationResult - Result from sendOTP
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<Object>} - User credential and token
   */
  verifyOTP: async (confirmationResult, otp) => {
    try {
      const userCredential = await verifyOTPCode(confirmationResult, otp);

      // Get user info
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Optional: Sync user with backend
      try {
        const response = await apiClient.post('/auth/create-user', {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          metadata: user.metadata,
        });

        return {
          status: 'success',
          message: 'OTP verified successfully',
          data: {
            user: response.data?.user || {
              id: user.uid,
              phoneNumber: user.phoneNumber,
            },
          },
          token,
          firebaseUser: user,
        };
      } catch (backendError) {
        // If backend sync fails, return Firebase user data
        console.warn('Backend sync failed, using Firebase user data:', backendError);
        return {
          status: 'success',
          message: 'OTP verified successfully',
          data: {
            user: {
              id: user.uid,
              phoneNumber: user.phoneNumber,
            },
          },
          token,
          firebaseUser: user,
        };
      }
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to verify OTP',
        error,
      };
    }
  },

  /**
   * Get current user
   * @returns {Promise<Object>} - Current user object or null
   */
  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get user ID token for API requests
   * @returns {Promise<string>} - User ID token
   */
  getUserToken: async () => {
    try {
      const token = await getUserToken();
      return token;
    } catch (error) {
      console.error('Error getting user token:', error);
      throw error;
    }
  },

  /**
   * Sign out user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await signOutUser();
      clearRecaptchaWidget();
      return { status: 'success', message: 'Logged out successfully' };
    } catch (error) {
      console.error('Error logging out:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to logout',
        error,
      };
    }
  },

  /**
   * Cleanup reCAPTCHA (optional, useful for cleanup)
   */
  cleanup: () => {
    clearRecaptchaWidget();
  },
};

export default authService;
