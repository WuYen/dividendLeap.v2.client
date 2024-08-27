import React, { Suspense, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useRecoilState, RecoilRoot } from 'recoil';

import { getLoginStatus } from './Login';
import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';
import MyPttContainer from './MyPttContainer.v2';
import { Box } from '@mui/material';
import { authState } from '../../state/atoms';

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ textAlign: 'center' }}>
          <PageTitle titleText={`MY PAGE`} />
          <TeaLoading />
        </Box>
      }
    >
      <RecoilRoot>
        <Container />
      </RecoilRoot>
    </Suspense>
  );
}

function Container() {
  const [{ isLoggedIn, userInfo }, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    //check again, cause after login authState won't update
    const [loginStatus, user] = getLoginStatus();
    if (loginStatus !== isLoggedIn) {
      setAuth({
        isLoggedIn: loginStatus,
        userInfo: user,
      });
    }

    if (!isLoggedIn && !loginStatus) {
      navigate(`/login`, { replace: true });
    }
  }, [navigate, isLoggedIn, setAuth]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <PageTitle titleText={'MY PAGE'} isLoggedIn={isLoggedIn} userInfo={userInfo} />
      {isLoggedIn ? <MyPttContainer /> : null}
      <Routes>
        <Route path='/setting' element={<SettingPage />} />
      </Routes>
    </Box>
  );
}

function SettingPage() {
  return <Box sx={{ textAlign: 'center' }}>this is setting</Box>;
}
