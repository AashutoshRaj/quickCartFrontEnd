import axios from "axios";

export const ADMIN_AUTH_TOKEN_KEY = "quickcart_admin_token";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token automatically if it exists
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle unauthorized errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default adminApi;
