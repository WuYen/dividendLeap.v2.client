import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utility/api';
import './form.css';
import PageTitle from '../common/PageTitle';

export function LoginPage(props) {
  return (
    <div>
      <PageTitle titleText={'Login'} />
      <InputAccountAndVerifyCode />
    </div>
  );
}

function InputAccountAndVerifyCode(props) {
  const [channel, setChannel] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  const handleSendVerifyCode = async () => {
    try {
      const response = await api.post('/login/account', { account });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response ? error.response.data.error : 'Error sending verify code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await api.post('/login/account', { account, verifyCode });
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setMessage(error.response ? error.response.data.error : 'Error verifying code');
    }
  };

  return (
    <>
      {step === 1 && (
        <div>
          <input
            type='text'
            placeholder='Enter your account'
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
          <button onClick={handleSendVerifyCode}>Send Verify Code</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type='text'
            placeholder='Enter the verification code'
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </>
  );
}
