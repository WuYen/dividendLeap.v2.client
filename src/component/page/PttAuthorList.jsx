import { useEffect, useState } from 'react';
import api from '../../utility/api';
import TeaLoading from '../loading/TeaLoading';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTitle from '../common/PageTitle';

export default function PttAuthorList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const response = await api.get(`/ptt/author/list`);
      console.log('fetch data', response);
      if (response.success) {
        setData(response.data);
        setIsLoading(false);
      } else {
        navigate('/error');
      }
    }
    fetchData();
    return () => {};
  }, [id, navigate]);

  return (
    <div className='App'>
      <PageTitle titleText={'作者列表'} />
      <div>
        {/* <div style={{ marginBottom: '20px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div> */}
        {isLoading ? (
          <TeaLoading />
        ) : data.length === 0 ? (
          <Empty />
        ) : (
          data.map((item) => {
            return (
              <div
                style={{
                  background: '#f9f9f9',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '5px',
                  maxWidth: '450px',
                  margin: '0 auto 10px',
                }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</span>
                <span style={{ color: '#888', marginLeft: '10px', marginRight: '10px' }}>Likes: {item.likes}</span>
                <Link to={`/ptt/author/${item.name}`}>Link</Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Empty(props) {
  return (
    <>
      <label>無資料</label>
    </>
  );
}
