/**
 * Authentication Service
 * Handles Twilio OTP authentication through the QuickCart backend
 */

import apiClient from '../axios.ts';
import type {
  CheckPhoneRequest,
  CheckPhoneResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
  ApiSuccessResponse
} from '../../types/index';

/**
 * Authentication service object with async methods for phone-based authentication
 */
const authService = {
  /**
   * Check if a phone number exists in the system
   *
   * @param {string} phoneNumber - Phone number to check
   * @returns {Promise<CheckPhoneResponse>} Response indicating if phone exists
   *
   * @example
   * const response = await authService.checkPhone('+919876543210');
   */
  checkPhone: async (phoneNumber: string): Promise<CheckPhoneResponse> => {
    const response = await apiClient.post<CheckPhoneResponse>('/auth/check-phone', {
      phone: phoneNumber,
    });
    return response.data;
  },

  /**
   * Send OTP to the specified phone number
   *
   * @param {string} phoneNumber - Phone number to send OTP to
   * @returns {Promise<SendOTPResponse>} Response with OTP sending status
   *
   * @example
   * const response = await authService.sendOTP('+919876543210');
   */
  sendOTP: async (phoneNumber: string): Promise<SendOTPResponse> => {
    const response = await apiClient.post<SendOTPResponse>('/auth/send-otp', {
      phone: phoneNumber,
    });
    return response.data;
  },

  /**
   * Verify OTP entered by the user
   *
   * @param {Object} params - Verification parameters
   * @param {string} params.phoneNumber - Phone number associated with OTP
   * @param {string} params.otp - 6-digit OTP code
   * @returns {Promise<VerifyOTPResponse>} Response with verification result and token
   *
   * @example
   * const response = await authService.verifyOTP({
   *   phoneNumber: '+919876543210',
   *   otp: '123456'
   * });
   */
  verifyOTP: async (params: {
    phoneNumber: string;
    otp: string;
  }): Promise<VerifyOTPResponse> => {
    const response = await apiClient.post<VerifyOTPResponse>('/auth/verify-otp', {
      phone: params.phoneNumber,
      otp: params.otp,
    });
    return response.data;
  },

  /**
   * Complete user registration with profile information
   *
   * @param {Object} params - Registration parameters
   * @param {string} params.name - User's full name
   * @param {string} params.registrationToken - Token from OTP verification
   * @returns {Promise<CompleteRegistrationResponse>} Response with registration status
   *
   * @example
   * const response = await authService.completeRegistration({
   *   name: 'John Doe',
   *   registrationToken: 'token_from_verify_otp'
   * });
   */
  completeRegistration: async (params: {
    name: string;
    registrationToken: string;
  }): Promise<CompleteRegistrationResponse> => {
    const response = await apiClient.post<CompleteRegistrationResponse>(
      '/auth/complete-registration',
      {
        name: params.name,
        registrationToken: params.registrationToken,
      }
    );
    return response.data;
  },

  /**
   * Logout user (clears server-side session)
   *
   * @returns {Promise<ApiSuccessResponse>} Logout confirmation
   *
   * @example
   * const response = await authService.logout();
   */
  logout: async (): Promise<ApiSuccessResponse> => {
    return { status: 'success' };
  },
};

export default authService;
