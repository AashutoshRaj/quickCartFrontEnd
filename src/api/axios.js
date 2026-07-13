import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

export default apiClient;
