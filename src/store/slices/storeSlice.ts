/**
 * Store Slice
 * Redux Toolkit slice for managing active store information
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { StoreStateType, ActiveStore, SetActiveStorePayload } from '../../types/index';

/**
 * Initialize store state from localStorage
 * Provides persistent store selection across sessions
 */
const initializeStoreState = (): StoreStateType => {
  const activeStore = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('activeStore') || 'null') : null;
  return {
    activeStore: activeStore || null,
  };
};

/**
 * Initial store state
 */
const initialState: StoreStateType = initializeStoreState();

/**
 * Store slice with reducers for managing active store
 */
const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    /**
     * Set the active store with full store information
     * Persists store data to localStorage for session recovery
     *
     * @param {StoreStateType} state - Current store state
     * @param {PayloadAction<SetActiveStorePayload>} action - Action containing store data
     *
     * @remarks
     * - Extracts specific store fields from API response
     * - Maintains backward compatibility with multiple name fields (name, storeName)
     * - Persists both activeStore object and activeStoreId for quick access
     *
     * @example
     * dispatch(setActiveStore({
     *   storeId: 'store_123',
     *   storeName: 'Downtown Store',
     *   address: '123 Main St',
     *   city: 'New York',
     *   currency: 'USD',
     *   status: 'active'
     * }));
     */
    setActiveStore: (state, action: PayloadAction<SetActiveStorePayload>) => {
      const storeData = action.payload;
      console.log('Full store data from API:', storeData);

      /**
       * Extract and store specific store fields
       * Supports multiple naming conventions for compatibility
       */
      state.activeStore = {
        storeId: storeData.storeId,
        name: storeData.name,
        storeName: storeData.storeName,
        logo: storeData.logo,
        currency: storeData.currency,
        address: storeData.address,
        city: storeData.city,
        state: storeData.state,
        country: storeData.country,
        timezone: storeData.timezone,
        phone: storeData.phone,
        phoneNumber: storeData.phoneNumber,
        status: storeData.status,
      };
      console.log('Stored activeStore in Redux:', state.activeStore);

      /**
       * Persist to localStorage for session recovery
       */
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('activeStore', JSON.stringify(state.activeStore));
        localStorage.setItem('activeStoreId', storeData.storeId);
      }
    },

    /**
     * Clear the active store
     * Removes store information and clears related localStorage entries
     *
     * @param {StoreStateType} state - Current store state
     *
     * @example
     * dispatch(clearActiveStore());
     */
    clearActiveStore: (state) => {
      state.activeStore = null;

      /**
       * Clear localStorage
       */
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('activeStore');
        localStorage.removeItem('activeStoreId');
      }
    },
  },
});

/**
 * Action creators exported from storeSlice
 */
export const { setActiveStore, clearActiveStore } = storeSlice.actions;

/**
 * Store reducer exported as default
 */
export default storeSlice.reducer;
