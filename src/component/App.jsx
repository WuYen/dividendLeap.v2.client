import './css/App.css';
import './css/form.css';
import './css/tab.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DividendSchedule from './page/DividendSchedule';
import Home from './page/Home';
import ServerError from './page/ServerError';
import LineNotifyRegistration from './page/LineNotifyRegistration';
import PttContainer from './page/PttContainer';
import LoginPage from './page/Login';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
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
      path: '/dividend',
      element: <DividendSchedule />,
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
      path: '/login',
      element: <LoginPage />,
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
