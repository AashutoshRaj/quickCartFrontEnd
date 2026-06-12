import apiClient from '../axios';

/**
 * Authentication Service
 * Handles Twilio OTP authentication through the QuickCart backend
 */
const authService = {
  checkPhone: async (phoneNumber) => {
    const response = await apiClient.post('/auth/check-phone', { phone: phoneNumber });
    return response.data;
  },
  sendOTP: async (phoneNumber) => {
    const response = await apiClient.post('/auth/send-otp', { phone: phoneNumber });
    return response.data;
  },
  verifyOTP: async ({ phoneNumber, otp }) => {
    const response = await apiClient.post('/auth/verify-otp', {
      phone: phoneNumber,
      otp,
    });
    return response.data;
  },
  completeRegistration: async ({ name, registrationToken }) => {
    const response = await apiClient.post('/auth/complete-registration', {
      name,
      registrationToken,
    });
    return response.data;
  },
  logout: async () => {
    return { status: 'success' };
  },
};

export default authService;
