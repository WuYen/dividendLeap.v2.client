import { useEffect, useState } from 'react';
import api from '../../utility/api';
import Loading from '../loading/Loading';
import PageTitle from '../common/PageTitle';

function PttStockBoard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get('/ptt/list');
      console.log('fetch data', response);
      if (response.success) {
        setData(response.data.posts);
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {};
  }, []);

  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank'); // '_blank' opens the link in a new tab or window
  };

  return (
    <div className='App'>
      <PageTitle titleText={'PTT Stock Board'} />
      {isLoading ? (
        <Loading />
      ) : (
        data.map((post) => {
          return (
            <div
              key={post.id}
              style={{
                maxWidth: '450px',
                margin: '0 auto 30px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => openNewPage(post.href)}
                  style={{
                    gridColumn: '1 / span 2',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  [{post.tag}] {post.title}
                </div>
                <div style={{ textAlign: 'left' }}>作者: {post.author}</div>
                <div style={{ textAlign: 'left' }}>日期: {post.date}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PttStockBoard;
