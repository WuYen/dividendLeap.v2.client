import { jwtDecode } from 'jwt-decode';

const isValidJWTFormat = (token) => {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    parts.forEach((part) => {
      if (!/^[A-Za-z0-9-_]+$/.test(part)) throw new Error('Invalid character found');
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      atob(base64); // Check if it can be decoded from base64
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const getLoginStatus = () => {
  try {
    const token = localStorage.getItem('token');
    if (token && isValidJWTFormat(token)) {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp - 86400 > currentTime;
      console.log('exp:', decoded.exp, ', current:', currentTime, ', isValid:', isValid);
      return [isValid, decoded];
    } else {
      console.error('invalid token', token);
      return [false, null];
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    localStorage.removeItem('token');
    return [false, null];
  }
};
