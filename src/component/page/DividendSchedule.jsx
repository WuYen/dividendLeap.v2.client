import { useEffect, useState } from 'react';
import api from '../../utility/api';
import Loading from '../Loading/Loading';
// import '../../App.css';

function DividendSchedule() {
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
      const response = await api.get('/stock/list');
      console.log('fetch data', response);
      if (response.success) {
        setSchedule(response.data.schedule);
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {};
  }, []);

  return (
    <div className="App">
      除權息預告 筆數: {schedule.length}
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
        <div className="loading-container">
          <Loading />
        </div>
      ) : schedule.length === 0 ? (
        <div>Empty</div>
      ) : (
        schedule.map((data, index) => {
          const showDate = schedule[index - 1]?.date !== data?.date;
          if (isMobile && showDate) {
            return (
              <>
                <div className="text-divider" style={{ margin: '10px 0px' }}>
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
    </div>
  );
}

function Item(props) {
  const { data, showDate, isMobile } = props;
  return (
    <div key={data.stockNo} style={{ margin: '5px 0px' }} className="row">
      {!isMobile && (
        <div style={{ minWidth: '100px', display: 'inline-block', textAlign: 'left' }}>{showDate ? data.date : ''}</div>
      )}
      <div
        className="hover-effect truncate-text"
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

export default DividendSchedule;
