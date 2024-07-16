import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './page/Home';
import ServerError from './page/ServerError';
import LineNotifyRegistration from './page/LineNotifyRegistration';
import PttContainer from './page/PttContainer';
import LoginPage from './page/Login';

const MyPage = lazy(() => import(/* webpackChunkName: "my-page" */ './page/MyPage'));

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ServerError />,
    },
    {
      path: '/login',
      element: <LoginPage />,
      errorElement: <ServerError />,
    },
    {
      path: '/my/*',
      element: <MyPage />,
      errorElement: <ServerError />,
    },
    {
      path: '/ptt/author/:id',
      element: <PttContainer />,
      errorElement: <ServerError />,
    },
    {
      path: '/line/registration',
      element: <LineNotifyRegistration isCallbackPage={false} />,
      errorElement: <ServerError />,
    },
    {
      path: '/line/registration/callback',
      element: <LineNotifyRegistration isCallbackPage={true} />,
      errorElement: <ServerError />,
    },
    {
      path: '*',
      element: <ServerError />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
