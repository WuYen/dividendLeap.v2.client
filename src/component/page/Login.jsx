import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utility/api';
import './form.css';
import PageTitle from '../common/PageTitle';

export const LoginPage = () => {
  const [account, setAccount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 向後端發送請求,觸發發送 Line Notify
      var response = await api.post('url', { account });
      console.log('Line Notify sent successfully');
    } catch (error) {
      console.error('An error occurred while sending Line Notify', error);
    }
  };

  return (
    <div>
      <PageTitle titleText={'Login'} />
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Account' value={account} onChange={(e) => setAccount(e.target.value)} />
        <button type='submit'>Send Line Notify</button>
      </form>
    </div>
  );
};

export const LoginSuccessPage = () => {
  const location = useLocation();

  useEffect(() => {
    const handleLogin = () => {
      const searchParams = new URLSearchParams(location.search);
      const jwt = searchParams.get('jwt');

      if (jwt) {
        // 將 JWT 存儲到 localStorage
        localStorage.setItem('jwt', jwt);
      } else {
        // 如果沒有 JWT,則導向到登入頁面
        window.location.href = '/login';
      }
    };

    handleLogin();
  }, [location]);

  return <div>Login successful!</div>;
};
