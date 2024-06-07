import React, { Suspense } from 'react';

import { InputAccountAndVerifyCode, getLoginStatus } from './Login';
import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';
import MyPttContainer from './MyPttContainer';

export default function MyPage() {
  const [isLoggedIn] = getLoginStatus();
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
        {isLoggedIn ? <MainPage /> : <InputAccountAndVerifyCode />}
      </div>
    </Suspense>
  );
}

function MainPage(props) {
  //const [isLoggedIn, userInfo] = getLoginStatus();

  return <MyPttContainer />;
}
