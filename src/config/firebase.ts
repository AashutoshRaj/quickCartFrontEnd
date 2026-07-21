/**
 * Firebase Configuration and Initialization
 * Handles Firebase app initialization and exports for use throughout the app
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import type { FirebaseConfig, FirebaseAppInstance, AuthInstance } from '../types/index';

/**
 * Firebase configuration from environment variables
 */
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Validate Firebase configuration
 * @returns {void}
 */
const validateFirebaseConfig = (): void => {
  const requiredKeys: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingKeys = requiredKeys.filter(
    (key) => !firebaseConfig[key] || firebaseConfig[key].includes('your_')
  );

  if (missingKeys.length > 0) {
    console.warn(
      `⚠️ Firebase Configuration Warning: Missing or invalid keys: ${missingKeys.join(', ')}. ` +
      'Please update your .env file with valid Firebase credentials.'
    );
  }
};

/**
 * Initialize Firebase application and authentication
 */
let app: FirebaseAppInstance | null = null;
let auth: AuthInstance | null = null;

try {
  validateFirebaseConfig();
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  /**
   * Enable persistence to maintain login state across page refreshes
   */
  setPersistence(auth, browserLocalPersistence).catch((error: Error) => {
    console.error('Error setting persistence:', error);
  });

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.warn('⚠️ Customer authentication features (phone-based login) will not work. Admin features will continue to work.');
}

export {
  app,
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
};
