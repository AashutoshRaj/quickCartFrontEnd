/**
 * Staff Authentication Slice
 * Redux Toolkit slice for Security Guard / Employee mobile app auth state.
 * Fully separate from the customer `authSlice` — different localStorage keys,
 * different actor shape, so customer and staff sessions never collide.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { StaffAuthStateType, SetStaffAuthPayload } from '../../types/index';

const initializeStaffAuthState = (): StaffAuthStateType => {
  const staffUser =
    typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('staff_user') || 'null') : null;
  const staffToken = typeof localStorage !== 'undefined' ? localStorage.getItem('staff_token') : null;

  return {
    staffUser: staffUser || null,
    staffToken: staffToken || null,
    isStaffAuthenticated: !!staffToken,
  };
};

const initialState: StaffAuthStateType = initializeStaffAuthState();

const staffAuthSlice = createSlice({
  name: 'staffAuth',
  initialState,
  reducers: {
    setStaffAuth: (state, action: PayloadAction<SetStaffAuthPayload>) => {
      const { staffUser, staffToken } = action.payload;
      state.staffUser = staffUser;
      state.staffToken = staffToken;
      state.isStaffAuthenticated = true;

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('staff_user', JSON.stringify(staffUser));
        localStorage.setItem('staff_token', staffToken);
      }
    },

    staffLogout: (state) => {
      state.staffUser = null;
      state.staffToken = null;
      state.isStaffAuthenticated = false;

      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('staff_user');
        localStorage.removeItem('staff_token');
      }
    },
  },
});

export const { setStaffAuth, staffLogout } = staffAuthSlice.actions;
export default staffAuthSlice.reducer;
