import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Link, CircularProgress } from '@mui/material';
import api from '../../utility/api';
import PageTitle from '../common/PageTitle';

// line/registration/callback?tokenInfo=%7B"channel":"123","token":"vLxmzyPpkuGZYDPy53d2cLXGk3hJ4iil4vI4G1SBpSI","updateDate":"20240712","notifyEnabled":true,"tokenLevel":["basic"],"verifyCode":null,"verifyCodeExpires":null,"favoritePosts":[],"_id":"66914e62a0c871f191cb3691","__v":0%7D
export default function LineNotifyRegistration(props) {
  const { isCallbackPage } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <PageTitle titleText='REGISTRATION' />
      {isCallbackPage ? <CallbackPage /> : <AccountForm />}
    </Box>
  );
}

function CallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  let tokenInfoObject = null;

  try {
    const tokenInfoString = new URLSearchParams(location.search).get('tokenInfo');
    const decodedTokenInfoString = decodeURIComponent(tokenInfoString);
    tokenInfoObject = JSON.parse(decodedTokenInfoString);
    if (!tokenInfoObject.channel) {
      tokenInfoObject = null;
      throw new Error('invalid token ' + decodedTokenInfoString);
    }
  } catch (error) {
    tokenInfoObject = null;
    console.warn('parse query token info fail', error);
  }

  useEffect(() => {
    if (tokenInfoObject == null) {
      navigate('/error');
    }
  }, [tokenInfoObject, navigate]);

  return (
    tokenInfoObject && (
      <Paper
        sx={{
          p: 3,
          width: { xs: '90%', sm: '400px' },
        }}
      >
        <Typography variant='body2' sx={{ mb: 2 }}>
          📢 說明: 解除通知請
          <Link href='https://help2.line.me/line_notify/web/pc?lang=zh-Hant&contentId=20003056' target='_blank' rel='noopener noreferrer'>
            參考
          </Link>
        </Typography>
        <Typography>恭喜</Typography>
        <Box sx={{ mb: 2 }} />
        <Typography>{tokenInfoObject.channel} 大大</Typography>
        <Box sx={{ mb: 2 }} />
        <Typography>註冊成功</Typography>
      </Paper>
    )
  );
}

export function AccountForm() {
  const [account, setAccount] = useState({ username: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const inputRef = useRef(null);
  const linkRef = useRef(null);
  const redirectLinkRef = useRef('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResponseData(null);
    setAccount((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    form.reportValidity(); // Trigger HTML5 validation messages
    if (form.checkValidity()) {
      setIsLoading(true);
      try {
        const resData = await handleAPICall(account.username);
        const status = resData.error ? 'FAILED' : 'SUCCESS';
        setResponseData({ status, data: resData });
        console.log('handleSubmit success', resData);
      } catch (error) {
        console.error('handleSubmit fail', error);
        setResponseData({ status: 'FAILED', data: null });
      }
      setIsLoading(false);
    }
  };

  const handleAPICall = async (channel) => {
    const realAPICallPromise = api.get(`/line/regis?channel=${channel}`);

    // 為了要能顯示loading, 故意卡一秒
    const [response] = await Promise.all([realAPICallPromise, new Promise((resolve) => setTimeout(resolve, 1000))]);
    if (response.success) {
      console.log(response);
      return response.data;
    } else {
      throw new Error(response.error);
    }
  };

  useEffect(() => {
    const timeoutIds = [];
    if (responseData && responseData.status) {
      if (responseData.status === 'FAILED') {
        const focusTimeoutId = setTimeout(() => {
          inputRef.current.focus(); // Reset focus to the input field
        }, 0);
        timeoutIds.push(focusTimeoutId);
      } else {
        if (responseData.data && responseData.data.redirectUrl) {
          const lineLink = responseData.data.redirectUrl; //.replace('https', 'line');
          const redirectTimeoutId = setTimeout(() => {
            //window.open(lineLink); // not work in iphone
            linkRef.current.setAttribute('href', lineLink);
            linkRef.current.click();
          }, 1000);
          timeoutIds.push(redirectTimeoutId);
          redirectLinkRef.current = { redirectUrl: lineLink };
        }
      }

      const responseDataTimeoutId = setTimeout(() => {
        setResponseData(null);
      }, 1800);
      timeoutIds.push(responseDataTimeoutId);
    }

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [responseData]);

  const { status } = responseData || {};

  return (
    <Paper
      sx={{
        p: 3,
        width: { xs: '90%', sm: '400px' },
      }}
    >
      <Typography variant='body2' sx={{ mb: 2 }}>
        📢 說明: 註冊後會收到分類為 [標的] 的PTT股版PO文
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={inputRef} // Set the input reference
          fullWidth
          variant='outlined'
          label='請問你的名字'
          name='username'
          value={account.username}
          onChange={handleChange}
          disabled={isLoading} // Disable input while loading
          required
          sx={{ mb: 2 }}
        />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : status ? (
          <Button variant='contained' fullWidth disabled className={status.toLowerCase()}>
            {status === 'FAILED' ? 'No~~ 失敗了' : 'Yes!! 成功了'}
            {responseData?.data?.error && <Typography>{responseData.data.error}</Typography>}
          </Button>
        ) : (
          <Button variant='contained' fullWidth type='submit'>
            註冊LINE通知
          </Button>
        )}

        <Box sx={{ mt: 2, display: redirectLinkRef.current && redirectLinkRef.current.redirectUrl ? 'block' : 'none' }}>
          <Link ref={linkRef} href={redirectLinkRef.current.redirectUrl} rel='noopener noreferrer'>
            兩秒後沒有自動跳轉請點這
          </Link>
        </Box>
      </form>
    </Paper>
  );
}

// 方法1. 先打开一个空白页, 再更新它的地址

// let oWindow = window.open("", "_blank");
// axios.get('xxx').then((url) => {
// oWindow.location = url;
// });

// 方法2. 超链接打开

// axios.get('xxx').then((url) => {
// let a = document.createElement('a');
// a.setAttribute('href', url);
// document.body.appendChild(dom);
// a.click();
// a.remove()
// });

// 方法3. 使用 window.location

// axios.get('xxx').then((url) => {
// window.location.href = url;
// });
