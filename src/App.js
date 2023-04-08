// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await get('https://jolly-bee-garment.cyclic.app/stock/list');
      console.log('fetch data', data);
      setSchedule(data.schedule);
    }
    fetchData();
    return () => {};
  }, [setSchedule]);

  return (
    <div className='App'>
      {schedule.length ? (
        schedule
          .sort(({ date: a }, { date: b }) => {
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          })
          .map((data, index) => {
            const formattedDate = `${data.date.slice(0, 4)}-${data.date.slice(4, 6)}-${data.date.slice(6)}`;
            return (
              <div key={data.stockNo}>
                <div style={{ minWidth: '100px', display: 'inline-block' }}>{formattedDate}</div>
                <div style={{ minWidth: '100px', display: 'inline-block' }}>{data.stockName}</div>
                <div style={{ minWidth: '50px', display: 'inline-block' }}>{data.stockNo}</div>
                <div style={{ minWidth: '50px', display: 'inline-block' }}>{data.cashDividen.toFixed(2)}</div>
              </div>
            );
          })
      ) : (
        <div>Empty</div>
      )}
    </div>
  );
}

function get(url) {
  return fetch(url, {
    method: 'GET',
    // headers: headers(),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log('error', error);
      return {
        success: false,
        data: null,
        error: error.name,
        message: error.message,
      };
    });
}

export default App;
