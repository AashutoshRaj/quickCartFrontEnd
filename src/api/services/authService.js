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
  verifyOTP: async (accessToken) => {
    const response = await apiClient.post('/auth/verify-otp', { accessToken });
    return response.data;
  },
};

export default authService;
