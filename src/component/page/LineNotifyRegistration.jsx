import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utility/api';
import './form.css';

export default function LineNotifyRegistration(props) {
  const { isCallbackPage } = props;

  return (
    <div className="App">
      <div>
        <h1 style={{ marginTop: '40px', marginBottom: '40px' }}>註冊 Line 通知</h1>
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
      throw new Error('invalid token: ' + decodedTokenInfoString);
    }
  } catch (error) {
    tokenInfoObject = null;
    console.error('parse token info from query fail', error);
  }

  useEffect(() => {
    if (tokenInfoObject == null) {
      navigate('/error');
    }
  }, [tokenInfoObject, navigate]);

  return (
    tokenInfoObject && (
      <div>
        <label>🎊🎊🎊🎊🎊🎊🎊🎊</label>
        <div className="regis-item-gap-1" />
        <label>🎊&nbsp; &nbsp; 註冊成功 &nbsp;&nbsp; 🎊</label>
        <div className="regis-item-gap-1" />
        <label>🎊🎊🎊🎊🎊🎊🎊🎊</label>
        <div className="regis-item-gap-10" />
        <label>尊貴的使用者: {tokenInfoObject.channel}</label>
      </div>
    )
  );
}

function AccountForm(props) {
  const [account, setAccount] = useState({ username: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const inputRef = useRef(null);

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
        console.log('handleSubmit success', resData);
        setResponseData({ message: 'SUCCESS', data: resData });
      } catch (error) {
        console.error('handleSubmit fail', error);
        setResponseData({ message: 'FAILED', data: null });
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
    if (responseData && responseData.message) {
      if (responseData.message === 'FAILED') {
        const focusTimeoutId = setTimeout(() => {
          inputRef.current.focus(); // Reset focus to the input field
        }, 0);
        timeoutIds.push(focusTimeoutId);
      } else {
        if (responseData.data && responseData.data.redirectUrl) {
          const redirectTimeoutId = setTimeout(() => {
            window.open(responseData.data.redirectUrl); // Open in a new tab
          }, 1000);
          timeoutIds.push(redirectTimeoutId);
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

  const { message, data } = responseData ? responseData : {};

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">你是誰👇</label>
          <div className="regis-item-gap-10" />
          <input
            ref={inputRef} // Set the input reference
            className="regis-input"
            type="text"
            name="username"
            id="username"
            value={account.username}
            onChange={handleChange}
            disabled={isLoading} // Disable input while loading
            required
          />
        </div>
        <div className="regis-item-gap-10" />
        {isLoading ? (
          <div className="regis-button">Loading...</div>
        ) : message ? (
          <>
            <div className={`regis-button ${message === 'FAILED' ? 'failed' : message === 'SUCCESS' ? 'success' : ''}`}>
              {message}
            </div>
            {data && data.redirectUrl ? (
              <div>
                <a href={data.redirectUrl} rel="noopener noreferrer">
                  兩秒後沒有自動跳轉請點這
                </a>
              </div>
            ) : null}
          </>
        ) : (
          <button className="regis-button" type="submit">
            👉 GO GO
          </button>
        )}
        <div className="regis-item-gap-10" />
      </form>
      <div>說明: 註冊後預設只會收到標題為 [標的] 的 Po 文</div>
    </>
  );
}
