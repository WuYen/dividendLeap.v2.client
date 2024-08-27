import React, { Suspense, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useRecoilState, RecoilRoot } from 'recoil';
import { Box } from '@mui/material';

import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';
import { authState } from '../../state/atoms';
import { DataLoader, PostListPage, MyPostListPage, AuthorRankPage, AuthorPostsPage } from './PttContainer.v2';
import SettingPage from './SettingPage';
import { getLoginStatus } from '../../utility/loginHelper';

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
      <DataLoader>
        <Routes>
          <Route path='/' element={<PostListPage />} />
          <Route path='/posts' element={<MyPostListPage />} />
          <Route path='/authors/rank' element={<AuthorRankPage />} />
          <Route path='/author/:id' element={<AuthorPostsPage />} />
          <Route path='/setting' element={<SettingPage />} />
        </Routes>
      </DataLoader>
    </Box>
  );
}
