import { jwtDecode } from 'jwt-decode';

export const getLoginStatus = () => {
  //TODO: move user state to recoil
  const token = localStorage.getItem('token');
  if (!!token) {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const isValid = decoded.exp - 86400 > currentTime;
    console.log('exp:', decoded.exp, ', current:', currentTime, ', isValid:', isValid);
    return [isValid, decoded];
  } else {
    return [false, null];
  }
};
