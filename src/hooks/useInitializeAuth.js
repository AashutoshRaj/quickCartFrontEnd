/**
 * Hook to initialize Firebase authentication state
 * Syncs Firebase auth state with Redux store on app load
 * Ensures persistent login across page refreshes
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth, logout } from '../store/slices/authSlice';
import { setupAuthStateListener } from '../utils/firebaseAuth';

export const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = setupAuthStateListener((firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated
        console.log('✅ User authenticated:', firebaseUser.phoneNumber);

        // Create user object from Firebase user
        const userData = {
          id: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          createdAt: firebaseUser.metadata?.creationTime,
        };

        // Get the existing token from localStorage
        const existingToken = localStorage.getItem('token');
        const existingUser = localStorage.getItem('user');

        if (existingUser && existingToken) {
          // Use existing user data if available
          const parsedUser = JSON.parse(existingUser);
          dispatch(setAuth({
            user: parsedUser,
            token: existingToken,
            firebaseUser,
          }));
        } else {
          // Otherwise use Firebase user data
          dispatch(setAuth({
            user: userData,
            token: firebaseUser.uid, // Use UID as temporary token
            firebaseUser,
          }));
        }
      } else {
        // User is not authenticated
        console.log('❌ User not authenticated');
        dispatch(logout());
      }
    });

    // Cleanup: Unsubscribe from auth state listener on unmount
    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);
};
