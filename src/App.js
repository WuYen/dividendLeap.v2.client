import './App.css';
import { useEffect, useState } from 'react';
import api from './utility/api';
// import List from './component/List';

function App() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await api.get('/stock/list');
      console.log('fetch data', data);
      setSchedule(data.schedule);
      setIsLoading(false);
    }
    fetchData();
    return () => {};
  }, []);

  return (
    <div className='App'>
      {!isMobile && (
        <div>
          <div style={{ minWidth: '100px', display: 'inline-block', textAlign: 'left' }}>日期</div>
          <div style={{ minWidth: '120px', display: 'inline-block', textAlign: 'left' }}>名稱</div>
          <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>股價</div>
          <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>現金股利</div>
          <div style={{ minWidth: '60px', display: 'inline-block', textAlign: 'right' }}>殖利率</div>
        </div>
      )}
      {isLoading ? (
        <div>Loading</div>
      ) : schedule.length === 0 ? (
        <div>Empty</div>
      ) : (
        schedule.map((data, index) => {
          const showDate = schedule[index - 1]?.date !== data?.date;
          if (isMobile && showDate) {
            return (
              <>
                <div className='text-divider' style={{ margin: '10px 0px' }}>
                  {data.date}
                </div>
                <div>
                  {!isMobile && (
                    <div style={{ minWidth: '100px', display: 'inline-block', textAlign: 'left' }}>日期</div>
                  )}
                  <div style={{ minWidth: '120px', display: 'inline-block', textAlign: 'left' }}>名稱</div>
                  <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>股價</div>
                  <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>現金股利</div>
                  <div style={{ minWidth: '60px', display: 'inline-block', textAlign: 'right' }}>殖利率</div>
                </div>
                <Item data={data} showDate={showDate} isMobile={isMobile} />
              </>
            );
          }
          return <Item data={data} showDate={showDate} isMobile={isMobile} />;
        })
      )}
      <style jsx>{`
        .App {
          margin-bottom: 88px;
        }

        .text-divider {
          display: flex;
          align-items: center;
        }

        .text-divider::before {
          content: '';
          height: 1px;
          background-color: silver;
          flex-grow: 1;
          margin: 0px 10px 0px 28px;
        }

        .text-divider::after {
          content: '';
          height: 1px;
          background-color: silver;
          flex-grow: 1;
          margin: 0px 28px 0px 10px;
        }

        .truncate-text {
          min-width: 120px;
          display: inline-block;
          text-align: left;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hover-effect {
          background-color: #f2f2f2;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        .hover-effect:hover {
          background-color: #d9d9d9;
        }

        .row {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

function Item(props) {
  const { data, showDate, isMobile } = props;
  return (
    <div key={data.stockNo} style={{ margin: '5px 0px' }} className='row'>
      {!isMobile && (
        <div style={{ minWidth: '100px', display: 'inline-block', textAlign: 'left' }}>{showDate ? data.date : ''}</div>
      )}
      <div
        className='hover-effect truncate-text'
        style={{ minWidth: '120px', display: 'inline-block', textAlign: 'left' }}
        onClick={() => {
          window.open(`https://www.google.com/search?q=股票${data.stockNo}`, '_blank');
        }}
      >{`${data.stockNo} ${data.stockName}`}</div>
      <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>{data.price}</div>
      <div style={{ minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>{data.cashDividen}</div>
      <div style={{ minWidth: '60px', display: 'inline-block', textAlign: 'right' }}>{data.yieldRatio}</div>
    </div>
  );
}

export default App;

// return (
//   <List
//     data={[
//       {
//         column1: 'column1-1',
//         column2: 'column1-2',
//         column3: 'column1-3',
//         column4: 'column1-4',
//         column5: 'column1-5',
//         column6: 'column1-6',
//       },
//       {
//         column1: 'column2-1',
//         column2: 'column2-2',
//         column3: 'column2-3',
//         column4: 'column2-4',
//         column5: 'column2-5',
//         column6: 'column2-6',
//       },
//       {
//         column1: 'column3-1',
//         column2: 'column3-2',
//         column3: 'column3-3',
//         column4: 'column3-4',
//         column5: 'column3-5',
//         column6: 'column3-',
//       },
//     ]}
//   ></List>
// );
