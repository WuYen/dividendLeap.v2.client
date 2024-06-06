import React, { useEffect } from 'react';

import { InputAccountAndVerifyCode } from './Login';
import PageTitle from '../common/PageTitle';

export default function MyPage() {
  useEffect(() => {
    // async function fetchData() {
    //   const response = await api.get(url);
    // }
    // fetchData();
  }, []);
  //TODO: find a ui library
  //TODO: navigation
  //TODO: login
  //TODO: tab page

  return (
    <div className='App'>
      <PageTitle titleText={'MY PAGE'} />
      <InputAccountAndVerifyCode />
    </div>
  );
}
