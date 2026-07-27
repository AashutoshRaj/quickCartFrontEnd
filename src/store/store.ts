/**
 * Redux Store Configuration
 * Configures Redux store with Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import storeReducer from './slices/storeSlice.ts';
import staffAuthReducer from './slices/staffAuthSlice.ts';
import type { RootState } from '../types/index';

/**
 * Configure and create Redux store
 * Combines reducers from auth and store slices
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeReducer,
    staffAuth: staffAuthReducer,
  },
});

/**
 * Export store as default
 */
export default store;

/**
 * Infer AppDispatch type from store
 * Used for typing dispatch functions throughout the app
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Re-export RootState type
 * Used for typing useSelector hooks
 */
export type { RootState };
