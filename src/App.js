import './App.css';
import { useEffect, useState } from 'react';
import api from './utility/api';

function App() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await api.get('/stock/list');
      console.log('fetch data', data);
      setSchedule(data.schedule);
    }
    fetchData();
    return () => {};
  }, []);

  return (
    <div className='App'>
      <div>
        <div style={{ minWidth: '100px', display: 'inline-block', textAlign: 'left' }}>日期</div>
        <div style={{ minWidth: '120px', display: 'inline-block', textAlign: 'left' }}>名稱</div>
        <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>股價</div>
        <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>現金股利</div>
        <div style={{ minWidth: '50px', display: 'inline-block', textAlign: 'right' }}>殖利率</div>
      </div>
      {schedule.length ? (
        schedule.map((data, index) => {
          const hideDate = schedule[index - 1]?.date == data?.date;
          return (
            <>
              {index != 0 && !hideDate && <br />}
              <div key={data.stockNo}>
                <div style={{ minWidth: '100px', display: 'inline-block', textAlign: 'left' }}>
                  {hideDate ? '' : data.date}
                </div>
                <div
                  style={{ minWidth: '120px', display: 'inline-block', textAlign: 'left' }}
                >{`(${data.stockNo})${data.stockName}`}</div>
                <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>{data.price}</div>
                <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>{data.cashDividen}</div>
                <div style={{ minWidth: '50px', display: 'inline-block', textAlign: 'right' }}>{data.yieldRatio}</div>
              </div>
            </>
          );
        })
      ) : (
        <div>Empty</div>
      )}
    </div>
  );
}

export default App;
