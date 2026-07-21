/**
 * User API
 * Handles user profile management and preferences
 */

import apiClient from './axios.ts';
import type {
  GetUserProfileResponse,
  UpdateLanguageRequest,
  UpdateNotificationsRequest,
  AddPaymentMethodRequest,
  UploadProfileImageRequest,
  ApiSuccessResponse
} from '../types/index';

/**
 * Get user profile information
 *
 * @returns {Promise<GetUserProfileResponse>} User profile data
 *
 * @example
 * const profile = await getUserProfile();
 */
export const getUserProfile = (): Promise<GetUserProfileResponse> => {
  return apiClient.get('/users/profile');
};

/**
 * Update user language preference
 *
 * @param {string} language - Language code or name (e.g., 'English (US)', 'Hindi')
 * @returns {Promise<ApiSuccessResponse>} Confirmation of language update
 *
 * @example
 * const response = await updateLanguage('Hindi');
 */
export const updateLanguage = (language: string): Promise<ApiSuccessResponse> => {
  return apiClient.patch('/users/language', { language });
};

/**
 * Update user notification settings
 *
 * @param {Object} data - Notification preferences
 * @param {boolean} [data.notificationsEnabled] - Enable/disable all notifications
 * @param {boolean} [data.emailNotifications] - Enable/disable email notifications
 * @param {boolean} [data.smsNotifications] - Enable/disable SMS notifications
 * @returns {Promise<GetUserProfileResponse>} Updated profile data
 *
 * @example
 * const response = await updateNotifications({
 *   notificationsEnabled: true,
 *   emailNotifications: false
 * });
 */
export const updateNotifications = (
  data: UpdateNotificationsRequest
): Promise<GetUserProfileResponse> => {
  return apiClient.patch('/users/notifications', data);
};

/**
 * Add a new payment method to user's saved methods
 *
 * @param {Object} data - Payment method details
 * @param {string} data.cardLast4 - Last 4 digits of card (for display only)
 * @param {string} data.expiryDate - Card expiry date (MM/YY format)
 * @param {string} data.cardholderName - Name on card
 * @param {boolean} [data.isDefault] - Set as default payment method
 * @returns {Promise<GetUserProfileResponse>} Updated profile with new payment method
 *
 * @example
 * const response = await addPaymentMethod({
 *   cardLast4: '4242',
 *   expiryDate: '12/26',
 *   cardholderName: 'John Doe',
 *   isDefault: true
 * });
 */
export const addPaymentMethod = (
  data: AddPaymentMethodRequest
): Promise<GetUserProfileResponse> => {
  return apiClient.post('/users/payment-methods', data);
};

/**
 * Delete a saved payment method
 *
 * @param {string} paymentMethodId - ID of payment method to delete
 * @returns {Promise<ApiSuccessResponse>} Confirmation of deletion
 *
 * @example
 * const response = await deletePaymentMethod('method_123');
 */
export const deletePaymentMethod = (paymentMethodId: string): Promise<ApiSuccessResponse> => {
  return apiClient.delete(`/users/payment-methods/${paymentMethodId}`);
};

/**
 * Set a payment method as default
 *
 * @param {string} paymentMethodId - ID of payment method to set as default
 * @returns {Promise<GetUserProfileResponse>} Updated profile with new default method
 *
 * @example
 * const response = await setDefaultPaymentMethod('method_123');
 */
export const setDefaultPaymentMethod = (
  paymentMethodId: string
): Promise<GetUserProfileResponse> => {
  return apiClient.patch(`/users/payment-methods/${paymentMethodId}/default`);
};

/**
 * Upload user profile image
 *
 * @param {FormData} formData - FormData containing image file with key 'profileImage'
 * @returns {Promise<GetUserProfileResponse>} Updated profile with new image URL
 *
 * @remarks
 * - Sends as multipart/form-data
 * - File should be added to FormData with key 'profileImage'
 *
 * @example
 * const formData = new FormData();
 * formData.append('profileImage', imageFile);
 * const response = await uploadProfileImage(formData);
 */
export const uploadProfileImage = (formData: FormData): Promise<GetUserProfileResponse> => {
  return apiClient.post('/users/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Delete user profile image
 *
 * @returns {Promise<ApiSuccessResponse>} Confirmation of deletion
 *
 * @example
 * const response = await deleteProfileImage();
 */
export const deleteProfileImage = (): Promise<ApiSuccessResponse> => {
  return apiClient.delete('/users/profile-image');
};
