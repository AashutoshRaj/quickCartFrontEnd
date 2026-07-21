/**
 * Axios Configuration
 * Creates and exports a configured axios instance for API communication
 */

import axios from 'axios';
import type { ApiClient } from '../types/index';

/**
 * Base URL for API requests, sourced from environment variables
 * Defaults to '/api/v1' if not specified
 */
const baseURL: string = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Create and configure axios instance with default settings
 * @remarks
 * - Includes credentials for authenticated requests
 * - Sets default JSON content type headers
 * - Configures 30-second request timeout
 */
const apiClient: ApiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

export default apiClient;
