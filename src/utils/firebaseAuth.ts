/**
 * Firebase Phone Authentication Helper Functions
 * Handles OTP sending, verification, and user management
 */

import { auth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from '../config/firebase.ts';
import type { FirebaseError } from 'firebase/app';
import type {
  RecaptchaVerifier as FirebaseRecaptchaVerifier,
  ConfirmationResult,
  UserCredential,
  User
} from 'firebase/auth';
import type { FirebaseAuthError, AuthStateCallback, UnsubscribeFunction } from '../types/index';

/**
 * Initialize reCAPTCHA verifier
 *
 * @param {string} containerId - ID of the container element for reCAPTCHA
 * @returns {RecaptchaVerifier} - RecaptchaVerifier instance
 * @throws {Error} If container element is not found
 *
 * @example
 * const verifier = initializeRecaptcha('recaptcha-container');
 */
export const initializeRecaptcha = (containerId: string): FirebaseRecaptchaVerifier => {
  try {
    /**
     * Check Firebase is initialized
     */
    if (!auth) {
      throw new Error('Firebase authentication not initialized. Please check your Firebase configuration.');
    }

    /**
     * Check if container exists
     */
    if (!document.getElementById(containerId)) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible', // 'invisible' or 'normal'
      callback: (token: string): void => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': (): void => {
        console.warn('reCAPTCHA token expired');
      },
      'error-callback': (): void => {
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
 *
 * @param {RecaptchaVerifier} verifier - RecaptchaVerifier instance to cleanup
 * @returns {void}
 *
 * @example
 * cleanupRecaptcha(verifier);
 */
export const cleanupRecaptcha = (verifier: FirebaseRecaptchaVerifier | null): void => {
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
 *
 * @param {string} phoneNumber - Phone number in format +country-code-number (e.g., +919876543210)
 * @param {RecaptchaVerifier} recaptchaVerifier - Initialized reCAPTCHA verifier
 * @returns {Promise<ConfirmationResult>} - Firebase confirmation result
 * @throws {FirebaseAuthError} If phone number is invalid or OTP sending fails
 *
 * @example
 * const confirmationResult = await sendOTPToPhone('+919876543210', verifier);
 */
export const sendOTPToPhone = async (
  phoneNumber: string,
  recaptchaVerifier: FirebaseRecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    /**
     * Validate phone number format
     */
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code (e.g., +919876543210)');
    }

    if (phoneNumber.length < 10) {
      throw new Error('Invalid phone number format');
    }

    console.log(`Sending OTP to ${phoneNumber}...`);

    /**
     * Send OTP using Firebase
     */
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );

    console.log('✅ OTP sent successfully');
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw handleFirebaseError(error as FirebaseError);
  }
};

/**
 * Verify OTP entered by user
 *
 * @param {ConfirmationResult} confirmationResult - Result from sendOTPToPhone
 * @param {string} otp - 6-digit OTP entered by user
 * @returns {Promise<UserCredential>} - Firebase user credential
 * @throws {FirebaseAuthError} If OTP is invalid or verification fails
 *
 * @example
 * const userCredential = await verifyOTPCode(confirmationResult, '123456');
 */
export const verifyOTPCode = async (
  confirmationResult: ConfirmationResult | null,
  otp: string
): Promise<UserCredential> => {
  try {
    if (!confirmationResult) {
      throw new Error('Confirmation result not found. Please request OTP again.');
    }

    if (otp.length !== 6) {
      throw new Error('OTP must be 6 digits');
    }

    console.log('Verifying OTP...');

    /**
     * Verify OTP
     */
    const userCredential = await confirmationResult.confirm(otp);

    console.log('✅ OTP verified successfully');
    return userCredential;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw handleFirebaseError(error as FirebaseError);
  }
};

/**
 * Get current authenticated user
 *
 * @returns {Promise<User | null>} - Firebase user object or null
 * @throws {Error} If auth state check fails
 *
 * @example
 * const user = await getCurrentUser();
 */
export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        unsubscribe();
        resolve(user);
      },
      (error: FirebaseError) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

/**
 * Get user ID token (for backend authentication)
 *
 * @returns {Promise<string>} - User ID token
 * @throws {Error} If user is not authenticated or token retrieval fails
 *
 * @example
 * const token = await getUserToken();
 */
export const getUserToken = async (): Promise<string> => {
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
 *
 * @returns {Promise<void>}
 * @throws {Error} If sign out fails
 *
 * @example
 * await signOutUser();
 */
export const signOutUser = async (): Promise<void> => {
  try {
    if (!auth) {
      throw new Error('Firebase authentication not initialized');
    }
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Handle Firebase errors and return user-friendly messages
 *
 * @param {FirebaseError} error - Firebase error object
 * @returns {FirebaseAuthError} - Error with user-friendly message
 *
 * @example
 * try {
 *   // Firebase operation
 * } catch (error) {
 *   throw handleFirebaseError(error as FirebaseError);
 * }
 */
export const handleFirebaseError = (error: FirebaseError): FirebaseAuthError => {
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

  const customError = new Error(userMessage) as FirebaseAuthError;
  customError.code = error.code;
  customError.originalError = error;

  return customError;
};

/**
 * Set up auth state listener
 *
 * @param {AuthStateCallback} callback - Callback function to handle auth state changes
 * @returns {UnsubscribeFunction} - Unsubscribe function to remove listener
 *
 * @example
 * const unsubscribe = setupAuthStateListener((user) => {
 *   console.log('Auth state changed:', user);
 * });
 *
 * // Later, to stop listening:
 * unsubscribe();
 */
export const setupAuthStateListener = (callback: AuthStateCallback): UnsubscribeFunction => {
  if (!auth) {
    console.warn('Firebase authentication not initialized. Auth state listener will not work.');
    return () => {}; // Return no-op unsubscribe function
  }

  const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
    callback(user);
  });

  return unsubscribe;
};
