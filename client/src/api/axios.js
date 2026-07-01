import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include authorization token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const tokenExists = !!token;
        
        console.log('📤 Request Interceptor:', {
          url: config.url,
          method: config.method,
          tokenExists,
          tokenLength: token?.length || 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'NONE'
        });
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token added to request headers');
        } else {
            console.warn('⚠️ No token found in localStorage - request will be UNAUTHENTICATED');
            console.warn('localStorage keys:', Object.keys(localStorage));
        }
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('❌ Unauthorized (401) - Token may be invalid or expired');
            // Optionally redirect to login
            // window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.error('❌ Forbidden (403) - Check if token is present in Authorization header');
            console.error('Error details:', error.response?.data);
        }
        return Promise.reject(error);
    }
);

export default API;