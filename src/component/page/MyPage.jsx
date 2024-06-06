import React from 'react';

import { InputAccountAndVerifyCode, getLoginStatus } from './Login';
import PageTitle from '../common/PageTitle';
import MyPttContainer from './MyPttContainer';

export default function MyPage() {
  const [isLoggedIn] = getLoginStatus();
  return (
    <div className='App'>
      <PageTitle titleText={'MY PAGE'} />
      {isLoggedIn ? <MainPage /> : <InputAccountAndVerifyCode />}
    </div>
  );
}

function MainPage(props) {
  //const [isLoggedIn, userInfo] = getLoginStatus();

  return <MyPttContainer />;
}
