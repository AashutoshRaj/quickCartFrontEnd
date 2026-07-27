/**
 * Authentication Slice
 * Redux Toolkit slice for managing authentication state
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthStateType, SetAuthPayload, FirebaseUserData } from '../../types/index';

/**
 * Initialize auth state from localStorage
 * Provides persistent authentication across sessions
 */
const initializeAuthState = (): AuthStateType => {
  const user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const firebaseUser = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('firebaseUser') || 'null') : null;

  return {
    user: user || null,
    token: token || null,
    firebaseUser: firebaseUser || null,
    isAuthenticated: !!token,
  };
};

/**
 * Initial authentication state
 */
const initialState: AuthStateType = initializeAuthState();

/**
 * Authentication slice with reducers for managing auth state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication state with user data and token
     * Persists data to localStorage for session recovery
     *
     * @param {AuthStateType} state - Current auth state
     * @param {PayloadAction<SetAuthPayload>} action - Action containing user, token, and optional firebaseUser
     *
     * @example
     * dispatch(setAuth({
     *   user: userData,
     *   token: 'auth_token',
     *   firebaseUser: firebaseUserData
     * }));
     */
    setAuth: (state, action: PayloadAction<SetAuthPayload>) => {
      const { user, token, firebaseUser } = action.payload;
      state.user = user;
      state.token = token;
      state.firebaseUser = firebaseUser || null;
      state.isAuthenticated = true;

      /**
       * Persist to localStorage for session recovery
       */
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        if (firebaseUser) {
          localStorage.setItem('firebaseUser', JSON.stringify({
            uid: firebaseUser.uid,
            phoneNumber: firebaseUser.phoneNumber,
            createdAt: firebaseUser.createdAt,
          }));
        }
      }
    },

    /**
     * Clear authentication state
     * Removes all user data, tokens, and clears localStorage
     *
     * @param {AuthStateType} state - Current auth state
     *
     * @example
     * dispatch(logout());
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.firebaseUser = null;
      state.isAuthenticated = false;

      /**
       * Clear localStorage
       */
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('firebaseUser');
      }
    },
  },
});

/**
 * Action creators exported from authSlice
 */
export const { setAuth, logout } = authSlice.actions;

/**
 * Auth reducer exported as default
 */
export default authSlice.reducer;
