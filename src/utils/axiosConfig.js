import axios from 'axios';
import toast from 'react-hot-toast';
import { isTokenExpired } from './tokenUtils';



// i used interceptipr aciox check on every requiest
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const publicEndpoints = ['/api/user/login', '/api/user/signup', '/api/user/register', '/api/product/', '/api/routerCategory/'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (token && !isPublicEndpoint && isTokenExpired(token)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      toast.error('Session expired. Please login again.');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      
      return Promise.reject(new Error('Token expired'));
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      toast.error('Session expired. Please login again.');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
    
    return Promise.reject(error);
  }
);

export default axios;
