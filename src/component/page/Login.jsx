import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import api from '../../utility/api';
import PageTitle from '../common/PageTitle';

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

export default function LoginPage(props) {
  return (
    <div className='App'>
      <PageTitle titleText={'LOGIN'} />
      <InputAccountAndVerifyCode />
    </div>
  );
}
export function InputAccountAndVerifyCode(props) {
  const [channel, setChannel] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [message, setMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleSendVerifyCode = async () => {
    try {
      const response = await api.post('/login/account', { account: channel });
      setMessage(response.message);
      setIsCodeSent(response.success);
    } catch (error) {
      setMessage('獲得驗證碼失敗');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await api.post('/login/verify', { account: channel, verifyCode: verifyCode });
      setMessage(response.message);
      localStorage.setItem('token', response.data);
      setTimeout(() => {
        navigate(`/my`, { replace: true });
      }, 2000);
    } catch (error) {
      setMessage('驗證失敗');
    }
  };

  return (
    <>
      {!isCodeSent ? (
        <div>
          <div style={{ marginBottom: '20px' }}>📢 說明: 輸入註冊Notify時輸入的名稱</div>
          <input className='regis-input' type='text' value={channel} onChange={(e) => setChannel(e.target.value)} required placeholder='輸入註冊名字' />
          <div className='regis-item-gap-20' />
          <button className='regis-button' onClick={handleSendVerifyCode}>
            獲取驗證碼
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>📢 說明: 輸入Line收到的驗證碼</div>
          <input className='regis-input' type='text' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} required placeholder='輸入驗證碼' />

          <div className='regis-item-gap-20' />
          <button className='regis-button' onClick={handleVerifyCode}>
            送出驗證碼
          </button>
        </div>
      )}
      {message && <p>{message}</p>}
    </>
  );
}
