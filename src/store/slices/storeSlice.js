import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStore: JSON.parse(localStorage.getItem('activeStore')) || null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setActiveStore: (state, action) => {
      const storeData = action.payload;
      state.activeStore = {
        storeId: storeData.storeId,
        name: storeData.name,
        logo: storeData.logo,
        currency: storeData.currency,
        address: storeData.address,
        timezone: storeData.timezone,
        phoneNumber: storeData.phoneNumber,
        status: storeData.status,
      };

      // Persist to localStorage
      localStorage.setItem('activeStore', JSON.stringify(state.activeStore));
      localStorage.setItem('activeStoreId', storeData.storeId);
    },

    clearActiveStore: (state) => {
      state.activeStore = null;
      localStorage.removeItem('activeStore');
      localStorage.removeItem('activeStoreId');
    },
  },
});

export const { setActiveStore, clearActiveStore } = storeSlice.actions;
export default storeSlice.reducer;
