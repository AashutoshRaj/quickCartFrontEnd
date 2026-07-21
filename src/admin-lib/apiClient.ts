import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Log the base URL for debugging (remove in production)
if (typeof window !== "undefined") {
  console.log("[API Client] Base URL:", baseURL);
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log outgoing requests for debugging
  console.log("[API Request]", config.method?.toUpperCase(), config.url);

  return config;
});

// Log response errors for debugging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;