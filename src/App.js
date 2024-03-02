import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DividendSchedule from './component/page/DividendSchedule';
import PttStockBoard from './component/page/PttStockBoard';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <DividendSchedule />,
      errorElement: <div>No~~</div>,
    },
    {
      path: '/ptt/stock',
      element: <PttStockBoard />,
      errorElement: <div>No~~</div>,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
