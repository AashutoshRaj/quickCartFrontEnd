/**
 * Firebase Phone Authentication Helper Functions
 * Handles OTP sending, verification, and user management
 */

import { auth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from '../config/firebase';
import { FirebaseError } from 'firebase/app';

/**
 * Initialize reCAPTCHA verifier
 * @param {string} containerId - ID of the container element for reCAPTCHA
 * @returns {RecaptchaVerifier} - RecaptchaVerifier instance
 */
export const initializeRecaptcha = (containerId) => {
  try {
    // Check if container exists
    if (!document.getElementById(containerId)) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible', // 'invisible' or 'normal'
      callback: (token) => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA token expired');
      },
      'error-callback': () => {
        console.error('reCAPTCHA error');
      },
    });

    return recaptchaVerifier;
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    throw error;
  }
};

/**
 * Clean up reCAPTCHA verifier
 * @param {RecaptchaVerifier} verifier - RecaptchaVerifier instance to cleanup
 */
export const cleanupRecaptcha = (verifier) => {
  if (verifier) {
    try {
      verifier.clear();
    } catch (error) {
      console.error('Error clearing reCAPTCHA:', error);
    }
  }
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number in format +country-code-number (e.g., +919876543210)
 * @param {RecaptchaVerifier} recaptchaVerifier - Initialized reCAPTCHA verifier
 * @returns {Promise<ConfirmationResult>} - Firebase confirmation result
 */
export const sendOTPToPhone = async (phoneNumber, recaptchaVerifier) => {
  try {
    // Validate phone number format
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code (e.g., +919876543210)');
    }

    if (phoneNumber.length < 10) {
      throw new Error('Invalid phone number format');
    }

    console.log(`Sending OTP to ${phoneNumber}...`);

    // Send OTP using Firebase
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );

    console.log('✅ OTP sent successfully');
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw handleFirebaseError(error);
  }
};

/**
 * Verify OTP entered by user
 * @param {ConfirmationResult} confirmationResult - Result from sendOTPToPhone
 * @param {string} otp - 6-digit OTP entered by user
 * @returns {Promise<UserCredential>} - Firebase user credential
 */
export const verifyOTPCode = async (confirmationResult, otp) => {
  try {
    if (!confirmationResult) {
      throw new Error('Confirmation result not found. Please request OTP again.');
    }

    if (otp.length !== 6) {
      throw new Error('OTP must be 6 digits');
    }

    console.log('Verifying OTP...');

    // Verify OTP
    const userCredential = await confirmationResult.confirm(otp);

    console.log('✅ OTP verified successfully');
    return userCredential;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw handleFirebaseError(error);
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<User|null>} - Firebase user object or null
 */
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

/**
 * Get user ID token (for backend authentication)
 * @returns {Promise<string>} - User ID token
 */
export const getUserToken = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting user token:', error);
    throw error;
  }
};

/**
 * Sign out user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Handle Firebase errors and return user-friendly messages
 * @param {FirebaseError} error - Firebase error object
 * @returns {Error} - Error with user-friendly message
 */
export const handleFirebaseError = (error) => {
  let userMessage = 'An error occurred. Please try again.';

  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-phone-number':
        userMessage = 'Invalid phone number format. Please check and try again.';
        break;
      case 'auth/too-many-requests':
        userMessage = 'Too many requests. Please try again later.';
        break;
      case 'auth/invalid-verification-code':
        userMessage = 'Invalid OTP. Please check and try again.';
        break;
      case 'auth/code-expired':
        userMessage = 'OTP has expired. Please request a new one.';
        break;
      case 'auth/invalid-credential':
        userMessage = 'Verification failed. Please try again.';
        break;
      case 'auth/missing-phone-number':
        userMessage = 'Phone number is required.';
        break;
      case 'auth/network-request-failed':
        userMessage = 'Network error. Please check your connection.';
        break;
      case 'auth/operation-not-allowed':
        userMessage = 'Phone authentication is not enabled. Please contact support.';
        break;
      case 'auth/internal-error':
        userMessage = 'Internal error occurred. Please try again.';
        break;
      default:
        userMessage = error.message || userMessage;
    }
  }

  const customError = new Error(userMessage);
  customError.code = error.code;
  customError.originalError = error;

  return customError;
};

/**
 * Set up auth state listener
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const setupAuthStateListener = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });

  return unsubscribe;
};
