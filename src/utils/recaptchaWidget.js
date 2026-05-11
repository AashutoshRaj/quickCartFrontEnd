/**
 * reCAPTCHA Widget Management
 * Handles initialization and cleanup of reCAPTCHA verifier
 */

import { RecaptchaVerifier } from '../config/firebase';
import { auth } from '../config/firebase';

let recaptchaVerifier = null;

/**
 * Initialize reCAPTCHA widget
 * @param {string} containerId - HTML element ID where reCAPTCHA will be rendered
 * @returns {RecaptchaVerifier} - Initialized reCAPTCHA verifier instance
 */
export const initRecaptchaWidget = (containerId) => {
  try {
    // Clear existing verifier if any
    if (recaptchaVerifier) {
      clearRecaptchaWidget();
    }

    // Ensure container exists
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`reCAPTCHA container with id "${containerId}" not found`);
    }

    // Initialize reCAPTCHA with invisible rendering
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      // Badge position: 'bottomright', 'bottomleft', 'inline'
      badge: 'bottomright',
      callback: (token) => {
        console.log('reCAPTCHA callback success');
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA token expired');
        recaptchaVerifier = null;
      },
      'error-callback': () => {
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
 * @returns {RecaptchaVerifier|null} - Current verifier or null
 */
export const getRecaptchaVerifier = () => {
  return recaptchaVerifier;
};

/**
 * Clear and cleanup reCAPTCHA widget
 */
export const clearRecaptchaWidget = () => {
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
 * @param {string} containerId - HTML element ID for reCAPTCHA
 * @returns {RecaptchaVerifier} - New reCAPTCHA verifier instance
 */
export const resetRecaptchaWidget = (containerId) => {
  clearRecaptchaWidget();
  return initRecaptchaWidget(containerId);
};
