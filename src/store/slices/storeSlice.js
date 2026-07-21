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
      console.log("Full store data from API:", storeData);
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
      console.log("Stored activeStore in Redux:", state.activeStore);

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
