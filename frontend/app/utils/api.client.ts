import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_HOST, // Your Django endpoint
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // This is vital for Django CSRF compatibility
  withCredentials: true, 
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Request Interceptor: Attach JWT or Auth Tokens
api.interceptors.request.use((config) => {
  const token = typeof document !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token logic
      console.error("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  }
);

export default api;