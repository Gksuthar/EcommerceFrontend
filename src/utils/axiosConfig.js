import axios from 'axios';
import toast from 'react-hot-toast';
import { isTokenExpired } from './tokenUtils';

// Add request interceptor to check token expiry before each request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    // Skip token check for login/register/public endpoints
    const publicEndpoints = ['/api/user/login', '/api/user/signup', '/api/user/register', '/api/product/', '/api/routerCategory/'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Only check token expiry if we have a token AND it's not a public endpoint
    if (token && !isPublicEndpoint && isTokenExpired(token)) {
      // Clear auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Show message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      
      // Cancel the request
      return Promise.reject(new Error('Token expired'));
    }
    
    // Add token to headers if it exists (even for public endpoints, in case user is logged in)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Show message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
    
    return Promise.reject(error);
  }
);

export default axios;
