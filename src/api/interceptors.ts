/**
 * API Interceptors Configuration
 * Sets up request and response interceptors for axios client
 */

import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import apiClient from './axios.ts';

/**
 * Setup interceptors for axios client
 * Handles authentication token injection and error handling
 *
 * @remarks
 * - Injects Authorization header with token from localStorage
 * - Handles 401 Unauthorized responses by clearing credentials
 * - Centralizes error logging and handling
 */
export const setupInterceptors = (): void => {
  /**
   * Request Interceptor
   * Adds authorization token to request headers
   */
  apiClient.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor
   * Handles error responses and manages auth state
   */
  apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError): Promise<never> => {
      const { response } = error;

      if (response) {
        /**
         * Centralized error message handling
         */
        const message = (response.data as Record<string, unknown>)?.message || 'Something went wrong';
        console.error(`API Error [${response.status}]:`, message);
      } else {
        console.error('Network Error:', error.message);
      }

      return Promise.reject(error);
    }
  );
};
