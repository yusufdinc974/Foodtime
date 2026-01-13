/**
 * API Client for FOOD TIME Backend
 * Centralized Axios configuration and API endpoints
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Use env variable in production
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('foodtime_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 unauthorized
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Don't redirect if it's an auth endpoint (login/signup)
        const isAuthEndpoint = error.config?.url?.includes('/auth/');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            // Token expired or invalid - logout
            localStorage.removeItem('foodtime_token');
            localStorage.removeItem('foodtime_user');
            window.location.href = '/'; // Redirect to login
        }
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    signup: (email, password, name, profileData = {}) =>
        api.post('/auth/signup', { email, password, name, ...profileData }),
    login: (email, password) =>
        api.post('/auth/login', { email, password }),
    getMe: () =>
        api.get('/auth/me'),
};

// User endpoints
export const userAPI = {
    getMe: () => api.get('/users/me'),
    update: (userData) => api.put('/users/me', userData),
    delete: () => api.delete('/users/me'),
};

export const mealAPI = {
    create: (mealData) => api.post('/meals', mealData),
    getHistory: (limit = 10) => api.get(`/meals/history?limit=${limit}`),
    getByDate: (date) => api.get(`/meals/date/${date}`),
    delete: (mealId) => api.delete(`/meals/${mealId}`),
};

// Export the base api instance for custom requests
export { api };

export const analysisAPI = {
    analyzeDaily: (data) => api.post('/analysis/daily', data),
    analyzeFood: (foodDescription) => api.post('/analysis/food', { food_description: foodDescription }),
    analyzePhoto: (imageBase64, mimeType = 'image/jpeg') =>
        api.post('/analysis/photo', { image_base64: imageBase64, mime_type: mimeType }),
};

export default api;
