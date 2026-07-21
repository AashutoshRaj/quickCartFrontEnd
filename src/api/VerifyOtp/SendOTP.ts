/**
 * MSG91 SendOTP Utility
 * Handles OTP widget initialization via MSG91 service
 */

import type { SendOTPInitConfig, MSG91ErrorData } from '../../types/index';

/**
 * Initialize MSG91 OTP widget for phone verification
 *
 * Validates configuration, formats phone number, and opens the OTP widget.
 * Requires MSG91 SDK (otp-provider.js) to be loaded in the page.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.phoneNumber - Phone number to send OTP to
 * @param {Function} config.onSuccess - Callback when OTP is verified (receives access token)
 * @param {Function} config.onFailure - Callback when OTP verification fails
 * @returns {void}
 *
 * @remarks
 * - Requires VITE_MSG91_WIDGET_ID and VITE_MSG91_TOKEN_AUTH environment variables
 * - Requires MSG91 otp-provider.js SDK to be loaded
 * - Phone number is automatically formatted with India country code (91) if not included
 * - Widget opens as invisible by default
 *
 * @example
 * initMsg91Widget({
 *   phoneNumber: '9876543210',
 *   onSuccess: (token) => console.log('Verified:', token),
 *   onFailure: (error) => console.error('Failed:', error)
 * });
 */
export const initMsg91Widget = ({
  phoneNumber,
  onSuccess,
  onFailure,
}: SendOTPInitConfig): void => {
  /**
   * Get configuration from environment variables
   */
  const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID;
  const tokenAuth = import.meta.env.VITE_MSG91_TOKEN_AUTH;

  /**
   * Validate environment configuration
   */
  if (!widgetId || !tokenAuth) {
    console.error(
      'MSG91 Configuration Error: Missing Widget ID or Token Auth'
    );
    return;
  }

  /**
   * Check if MSG91 SDK is loaded
   */
  if (typeof window.initSendOTP !== 'function') {
    console.error(
      'MSG91 SDK Error: otp-provider.js not loaded'
    );
    return;
  }

  /**
   * Format phone number:
   * - Remove all non-digit characters
   * - Add India country code (91) if not present
   */
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('91')
    ? cleanPhone
    : `91${cleanPhone}`;

  /**
   * Configure widget with callbacks
   */
  const widgetConfig = {
    widgetId,
    tokenAuth,
    identifier: formattedPhone,
    exposeMethods: true,

    /**
     * Success callback - receives OTP access token
     */
    success: (data: Record<string, unknown>): void => {
      console.log('MSG91 Success:', data);

      /**
       * Extract access token from response
       */
      const accessToken = data.message as string;

      if (onSuccess) {
        onSuccess(accessToken);
      }
    },

    /**
     * Failure callback - handles OTP verification errors
     */
    failure: (error: MSG91ErrorData): void => {
      console.error('MSG91 Failure:', error);

      if (onFailure) {
        onFailure(error);
      }
    },
  };

  /**
   * Initialize and display the OTP widget
   */
  window.initSendOTP(widgetConfig);
};
