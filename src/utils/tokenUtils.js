import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const checkTokenExpiry = () => {
  const token = localStorage.getItem('accessToken');
  
  if (isTokenExpired(token)) {
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
    
    return false;
  }
  
  return true;
};

// Setup automatic token check
export const setupTokenExpiryCheck = () => {
  // Check every 60 seconds
  const interval = setInterval(() => {
    checkTokenExpiry();
  }, 60000);
  
  // Check immediately on page load
  checkTokenExpiry();
  
  return interval;
};
