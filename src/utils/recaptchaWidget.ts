/**
 * reCAPTCHA Widget Management
 * Handles initialization and cleanup of reCAPTCHA verifier
 */

import { RecaptchaVerifier, auth } from '../config/firebase.ts';
import type { RecaptchaVerifier as FirebaseRecaptchaVerifier } from 'firebase/auth';

/**
 * Module-level reCAPTCHA verifier instance
 * @internal
 */
let recaptchaVerifier: FirebaseRecaptchaVerifier | null = null;

/**
 * Initialize reCAPTCHA widget
 *
 * @param {string} containerId - HTML element ID where reCAPTCHA will be rendered
 * @returns {RecaptchaVerifier} - Initialized reCAPTCHA verifier instance
 * @throws {Error} If container element is not found
 *
 * @remarks
 * - Automatically clears existing verifier before initializing new one
 * - Renders as invisible by default with badge in bottom-right corner
 * - Handles token expiration and error callbacks
 *
 * @example
 * const verifier = initRecaptchaWidget('recaptcha-container');
 */
export const initRecaptchaWidget = (containerId: string): FirebaseRecaptchaVerifier => {
  try {
    /**
     * Clear existing verifier if any
     */
    if (recaptchaVerifier) {
      clearRecaptchaWidget();
    }

    /**
     * Ensure container exists
     */
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`reCAPTCHA container with id "${containerId}" not found`);
    }

    /**
     * Initialize reCAPTCHA with invisible rendering
     */
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      // Badge position: 'bottomright', 'bottomleft', 'inline'
      badge: 'bottomright',
      callback: (token: string): void => {
        console.log('reCAPTCHA callback success');
      },
      'expired-callback': (): void => {
        console.warn('reCAPTCHA token expired');
        recaptchaVerifier = null;
      },
      'error-callback': (): void => {
        console.error('reCAPTCHA error callback');
        recaptchaVerifier = null;
      },
    });

    console.log('✅ reCAPTCHA initialized successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('❌ Error initializing reCAPTCHA:', error);
    recaptchaVerifier = null;
    throw error;
  }
};

/**
 * Get current reCAPTCHA verifier instance
 *
 * @returns {RecaptchaVerifier | null} - Current verifier or null if not initialized
 *
 * @example
 * const verifier = getRecaptchaVerifier();
 * if (verifier) {
 *   // Use verifier
 * }
 */
export const getRecaptchaVerifier = (): FirebaseRecaptchaVerifier | null => {
  return recaptchaVerifier;
};

/**
 * Clear and cleanup reCAPTCHA widget
 *
 * @returns {void}
 *
 * @remarks
 * - Safely clears the reCAPTCHA verifier
 * - Sets internal reference to null
 * - Handles errors gracefully during cleanup
 *
 * @example
 * clearRecaptchaWidget();
 */
export const clearRecaptchaWidget = (): void => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
      console.log('✅ reCAPTCHA cleared');
    }
  } catch (error) {
    console.error('Error clearing reCAPTCHA:', error);
    recaptchaVerifier = null;
  }
};

/**
 * Reset reCAPTCHA widget (reinitialize for new verification)
 *
 * @param {string} containerId - HTML element ID for reCAPTCHA
 * @returns {RecaptchaVerifier} - New reCAPTCHA verifier instance
 *
 * @remarks
 * - Clears existing verifier before reinitializing
 * - Useful for resetting after failed verification attempts
 *
 * @example
 * const newVerifier = resetRecaptchaWidget('recaptcha-container');
 */
export const resetRecaptchaWidget = (containerId: string): FirebaseRecaptchaVerifier => {
  clearRecaptchaWidget();
  return initRecaptchaWidget(containerId);
};
