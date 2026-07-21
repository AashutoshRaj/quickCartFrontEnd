/**
 * Initialize Auth Hook
 * Restores authentication state from localStorage on app load
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout, setAuth } from '../store/slices/authSlice.ts';

/**
 * Hook to initialize authentication state from localStorage
 *
 * Runs on app mount to restore user session if a valid token and user data exist.
 * Clears auth state if restoration fails or data is missing.
 *
 * @returns {void}
 *
 * @remarks
 * - Checks for token and user data in localStorage
 * - Dispatches logout if no valid data found
 * - Catches and logs errors during deserialization
 * - Should be called in root component (App.tsx)
 *
 * @example
 * export function App() {
 *   useInitializeAuth();
 *   return <Routes>...</Routes>;
 * }
 */
export const useInitializeAuth = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    /**
     * Retrieve auth data from localStorage
     */
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    /**
     * If no token or user data, logout to clear any stale state
     */
    if (!token || !user) {
      dispatch(logout());
      return;
    }

    try {
      /**
       * Restore auth state from localStorage
       */
      dispatch(setAuth({ user: JSON.parse(user), token }));
    } catch (error) {
      /**
       * On JSON parse error, clear auth state
       */
      console.error('Failed to restore auth session:', error);
      dispatch(logout());
    }
  }, [dispatch]);
};
