import React, { lazy, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './page/Home';
import ServerError from './page/ServerError';
import LineNotifyRegistration from './page/LineNotifyRegistration';
import PttContainer from './page/PttContainer';
import LoginPage from './page/Login';

const MyPage = lazy(() => import(/* webpackChunkName: "my-page" */ './page/MyPage'));
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
function App() {
  useEffect(() => {
    const publicVapidKey = 'BNl99vtqzxABDsmqzgNXTk_1fR7J9Q5c9F5SSq-5BlEszYQUEcvHYTdR6n-IIovt0B0_kWxhyWjL2q_0znVAGYQ';

    if (!publicVapidKey) {
      console.error('VAPID public key is not defined.');
      return;
    }

    // 將 Base64 字串轉換為 UInt8Array
    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    // 請求通知權限並訂閱
    const subscribeUser = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // 將訂閱資訊發送到伺服器
        const response = await fetch('http://localhost:8000/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });

        if (response.ok) {
          console.log('User is subscribed:', subscription);
        } else {
          console.error('Failed to subscribe the user.');
        }
      } catch (err) {
        console.error('Failed to subscribe user:', err);
      }
    };

    // 請求權限並訂閱
    subscribeUser();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
