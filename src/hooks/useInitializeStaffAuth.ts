/**
 * Initialize Staff Auth Hook
 * Restores Security Guard / Employee auth state from localStorage on app load
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { staffLogout, setStaffAuth } from '../store/slices/staffAuthSlice.ts';

export const useInitializeStaffAuth = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    const staffToken = localStorage.getItem('staff_token');
    const staffUser = localStorage.getItem('staff_user');

    if (!staffToken || !staffUser) {
      dispatch(staffLogout());
      return;
    }

    try {
      dispatch(setStaffAuth({ staffUser: JSON.parse(staffUser), staffToken }));
    } catch (error) {
      console.error('Failed to restore staff auth session:', error);
      dispatch(staffLogout());
    }
  }, [dispatch]);
};
