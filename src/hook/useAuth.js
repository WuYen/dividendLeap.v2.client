// authService.js
import { useRecoilState } from 'recoil';
import { authState } from '../state//atoms';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp - 86400 > currentTime;

      setAuth({
        isLoggedIn: isValid,
        userInfo: isValid ? decoded : null,
      });
    } else {
      setAuth({
        isLoggedIn: false,
        userInfo: null,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      isLoggedIn: false,
      userInfo: null,
    });
  };

  return { auth, checkLoginStatus, logout };
};
