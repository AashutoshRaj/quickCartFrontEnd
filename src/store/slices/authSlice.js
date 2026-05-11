import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  firebaseUser: JSON.parse(localStorage.getItem('firebaseUser')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication state with user data and token
     * Persists to localStorage for session recovery
     */
    setAuth: (state, action) => {
      const { user, token, firebaseUser } = action.payload;
      state.user = user;
      state.token = token;
      state.firebaseUser = firebaseUser || null;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      if (firebaseUser) {
        localStorage.setItem('firebaseUser', JSON.stringify({
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          createdAt: firebaseUser.metadata?.creationTime,
        }));
      }
    },

    /**
     * Clear authentication state
     * Removes all user data and tokens
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.firebaseUser = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseUser');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
