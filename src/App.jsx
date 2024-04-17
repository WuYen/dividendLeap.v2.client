import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DividendSchedule from './component/page/DividendSchedule';
import PttStockBoard from './component/page/PttStockBoard';
import PttAuthorHistoryInfo from './component/page/PttAuthorHistoryInfo';
import Home from './component/page/Home';
import ServerError from './component/page/ServerError';
import LineNotifyRegistration from './component/page/LineNotifyRegistration';
import PttAuthorList from './component/page/PttAuthorList';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ServerError />,
    },
    {
      path: '/ptt',
      element: <PttStockBoard />,
      errorElement: <ServerError />,
    },
    {
      path: '/ptt/author/list',
      element: <PttAuthorList />,
      errorElement: <ServerError />,
    },
    {
      path: '/ptt/author/:id',
      element: <PttAuthorHistoryInfo />,
      errorElement: <ServerError />,
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
      path: '*',
      element: <ServerError />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
