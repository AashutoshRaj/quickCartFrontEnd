import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout, setAuth } from '../store/slices/authSlice';

export const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      dispatch(logout());
      return;
    }

    try {
      dispatch(setAuth({ user: JSON.parse(user), token }));
    } catch (error) {
      console.error('Failed to restore auth session:', error);
      dispatch(logout());
    }
  }, [dispatch]);
};
