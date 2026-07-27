/**
 * Staff API Client
 * Axios instance for Security Guard / Employee mobile-app requests.
 * Mirrors admin-auth/api.ts's pattern but keyed on the separate `staff_token`
 * localStorage key so customer, admin, and staff sessions never collide.
 */

import axios from 'axios';

export const STAFF_AUTH_TOKEN_KEY = 'staff_token';

const staffApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

staffApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STAFF_AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

staffApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(STAFF_AUTH_TOKEN_KEY);
      localStorage.removeItem('staff_user');
    }
    return Promise.reject(error);
  }
);

export default staffApiClient;
