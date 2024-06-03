import { useState } from 'react';
import api from '../../utility/api';
import './form.css';
import PageTitle from '../common/PageTitle';

export default function LoginPage(props) {
  return (
    <div className='App'>
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

  const handleSendVerifyCode = async (channel) => {
    try {
      const response = await api.post('/login/account', { account: channel });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response ? error.response.data.error : 'Error sending verify code');
    }
  };

  const handleVerifyCode = async (channel, verifyCode) => {
    try {
      const response = await api.post('/login/verify', { account: channel, verifyCode: verifyCode });
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
          <input type='text' placeholder='Enter your account' value={channel} onChange={(e) => setChannel(e.target.value)} />
          <button onClick={() => handleSendVerifyCode(channel)}>Get Verify Code</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input type='text' placeholder='Enter the verification code' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
          <button onClick={() => handleVerifyCode(channel, verifyCode)}>Verify Code</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </>
  );
}
