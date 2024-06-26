import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utility/api';
import PageTitle from '../common/PageTitle';

export default function LineNotifyRegistration(props) {
  const { isCallbackPage } = props;

  return (
    <div className='App'>
      <div>
        <PageTitle titleText={'REGISTRATION'} />
        {isCallbackPage ? <CallbackPage /> : <AccountForm />}
      </div>
    </div>
  );
}

function CallbackPage(props) {
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
      <div>
        <div style={{ marginBottom: '20px' }}>
          📢 說明: 解除通知請
          <a
            href='https://help2.line.me/line_notify/web/pc?lang=zh-Hant&contentId=20003056'
            className='reference-link'
            target='_blank'
            rel='noopener noreferrer'
          >
            參考
          </a>
        </div>
        <label>恭喜</label>
        <div className='regis-item-gap-10' />
        <label>{tokenInfoObject.channel} 大大</label>
        <div className='regis-item-gap-10' />
        <label>註冊成功</label>
      </div>
    )
  );
}

export function AccountForm(props) {
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
    var form = event.target;
    form.reportValidity(); // Trigger HTML5 validation messages
    if (form.checkValidity()) {
      setIsLoading(true);
      try {
        var resData = await handleAPICall(account.username);
        var status = resData.error ? 'FAILED' : 'SUCCESS';
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
    const realAPICallPromise = api.get('/line/regis?channel=' + channel);

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
    let timeoutIds = [];
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

  var { status } = responseData ? responseData : {};

  return (
    <>
      <div style={{ marginBottom: '20px' }}>📢 說明: 註冊後會收到分類為 [標的] 的PTT股版PO文</div>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef} // Set the input reference
          className='regis-input'
          type='text'
          name='username'
          id='username'
          value={account.username}
          onChange={handleChange}
          disabled={isLoading} // Disable input while loading
          required
          placeholder='請問你的名字'
        />
        <div className='regis-item-gap-20' />
        {isLoading ? (
          <div className='regis-button'>Loading...</div>
        ) : status ? (
          <div className={`regis-button ${status.toLowerCase()}`}>
            {status === 'FAILED' ? 'No~~ 失敗了' : 'Yes!! 成功了'}
            <br />
            <label>{responseData?.data?.error || ''}</label>
          </div>
        ) : (
          <button className='regis-button' type='submit'>
            註冊LINE通知
          </button>
        )}

        <div style={{ display: redirectLinkRef.current && redirectLinkRef.current.redirectUrl ? 'block' : 'none' }}>
          <div className='regis-item-gap-10' />
          <a ref={linkRef} href={redirectLinkRef.current.redirectUrl} rel='noopener noreferrer'>
            兩秒後沒有自動跳轉請點這
          </a>
        </div>

        <div className='regis-item-gap-10' />
      </form>
    </>
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
