import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    response => response,
    error => {
        // Handle 401 Unauthorized globally if needed
        if (error.response?.status === 401) {
            // Optional: Clear token and redirect to login
            // if (typeof window !== 'undefined') {
            //   localStorage.removeItem('token');
            //   window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    },
);

export default api;
