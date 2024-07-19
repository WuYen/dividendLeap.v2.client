import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utility/api';
import PageTitle from '../common/PageTitle';

//TODO: move user state to recoil
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
      throw new Error('Invalid token format');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    localStorage.removeItem('token');
    return [false, null];
  }
};
export default function LoginPage(props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <PageTitle titleText='LOGIN' />
      <InputAccountAndVerifyCode />
    </Box>
  );
}

export function InputAccountAndVerifyCode(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [channel, setChannel] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [message, setMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const channelFromQuery = searchParams.get('channel');
    if (channelFromQuery) {
      setChannel(channelFromQuery);
    }
  }, [location.search]);

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
    <Paper sx={{ p: 3, width: '400px' }}>
      {!isCodeSent ? (
        <Box>
          <Typography variant='body2' sx={{ mb: 2 }}>
            📢 說明: 輸入註冊Notify時輸入的名稱
          </Typography>
          <TextField
            fullWidth
            variant='outlined'
            label='輸入註冊名字'
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button variant='contained' fullWidth onClick={handleSendVerifyCode}>
            獲取驗證碼
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant='body2' sx={{ mb: 2 }}>
            📢 說明: 輸入Line收到的驗證碼
          </Typography>
          <TextField
            fullWidth
            variant='outlined'
            label='輸入驗證碼'
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button variant='contained' fullWidth onClick={handleVerifyCode}>
            送出驗證碼
          </Button>
        </Box>
      )}
      {message && (
        <Typography variant='body2' sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
}
