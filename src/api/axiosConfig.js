import axios from "axios";
import authService from "../services/authService";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        if (authService.isInitialized() && authService.isAuthenticated()) {
            const token = authService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Si recibimos 401 y no hemos intentado renovar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const newToken = await authService.updateToken(5);
                
                // Update the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error renovando token:', refreshError);
                // If token renewal fails, redirect to login and reject the request
                authService.login();
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;