import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './page/Home';
import ServerError from './page/ServerError';
import LineNotifyRegistration from './page/LineNotifyRegistration';
import PttContainer from './page/PttContainer';

import './css/App.css';
import './css/form.css';
import './css/tab.css';
import TeaLoading from './common/TeaLoading';
import PageTitle from './common/PageTitle';

const MyPage = lazy(() => import(/* webpackChunkName: "my-page" */ './page/MyPage'));

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ServerError />,
    },
    {
      path: '/my',
      element: (
        <Suspense
          fallback={
            <div className='App'>
              <PageTitle titleText={`MY PAGE`} />
              <TeaLoading />
            </div>
          }
        >
          <MyPage />
        </Suspense>
      ),
      errorElement: <ServerError />,
    },
    {
      path: '/ptt',
      element: <PttContainer />,
      errorElement: <ServerError />,
      children: [
        {
          path: 'author/list',
          element: <PttContainer />,
        },
        {
          path: 'author/:id',
          element: <PttContainer />,
        },
      ],
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
