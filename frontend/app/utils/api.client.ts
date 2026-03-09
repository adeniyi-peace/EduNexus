// app/utils/api.client.ts
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_HOST,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true, 
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

api.interceptors.request.use((config) => {
    const token = typeof document !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops if the refresh endpoint itself fails
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (!refreshToken) throw new Error("No refresh token available");

                // Assuming your Django DRF simplejwt endpoint for refreshing
                const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                localStorage.setItem(ACCESS_TOKEN, data.access);
                
                // Update the original request header and retry
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                console.error("Session expired. Redirecting to login...");
                // Clear tokens and reset auth state via the store
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);

                // Reset Zustand auth state if the store has been loaded
                try {
                    const { useUserContext } = await import("~/hooks/useUserContext");
                    const state = useUserContext.getState();
                    if (state.isAuthenticated) {
                        // Don't call logout() to avoid infinite loop — just reset state
                        useUserContext.setState({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                    }
                } catch {
                    // Store not available yet — tokens already cleared above
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;