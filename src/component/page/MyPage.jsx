import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoginStatus } from './Login';
import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';
import MyPttContainer from './MyPttContainer.v2';

export default function MyPage() {
  const [isLoggedIn] = getLoginStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login`, { replace: true });
    }
  }, [navigate, isLoggedIn]);

  return (
    <Suspense fallback={<MyPagePreload />}>
      <div className='App'>
        <PageTitle titleText={'MY PAGE'} />
        {isLoggedIn ? <MyPttContainer /> : null}
      </div>
    </Suspense>
  );
}

function MyPagePreload() {
  return (
    <div className='App'>
      <PageTitle titleText={`MY PAGE`} />
      <TeaLoading />
    </div>
  );
}
