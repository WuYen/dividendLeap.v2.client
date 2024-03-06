import { useEffect, useState } from 'react';
import api from '../../utility/api';
import Loading from '../Loading/Loading';

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
    <div className="App">
      <h1 style={{ marginTop: '40px', marginBottom: '40px' }}>PTT Stock Board</h1>
      {isLoading ? (
        <Loading />
      ) : (
        data.map((post) => {
          return (
            <div key={post.id} style={{ marginBottom: '10px' }}>
              <span
                onClick={() => openNewPage(post.href)}
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
              >
                [{post.tag}] {post.title}
              </span>
              <div>
                <span style={{ marginRight: '20px' }}>作者: {post.author}</span>
                <span>日期: {post.date}</span>
              </div>
              <hr style={{ width: '25%' }}></hr>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PttStockBoard;
