import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoginStatus } from './Login';
import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';
import MyPttContainer from './MyPttContainer';

export default function MyPage() {
  const [isLoggedIn] = getLoginStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login`, { replace: true });
    }
  }, [navigate, isLoggedIn]);

  return (
    <Suspense
      fallback={
        <div className='App'>
          <PageTitle titleText={`MY PAGE`} />
          <TeaLoading />
        </div>
      }
    >
      <div className='App'>
        <PageTitle titleText={'MY PAGE'} />
        {isLoggedIn ? <MainPage /> : null}
      </div>
    </Suspense>
  );
}

function MainPage(props) {
  //const [isLoggedIn, userInfo] = getLoginStatus();

  return <MyPttContainer />;
}
