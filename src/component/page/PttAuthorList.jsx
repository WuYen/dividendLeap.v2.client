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
      {isLoading ? (
        <TeaLoading />
      ) : data.length === 0 ? (
        <Empty />
      ) : (
        data.map((item) => {
          return (
            <div
              key={item.name}
              style={{
                maxWidth: '450px',
                margin: '0 auto 30px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                position: 'relative',
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
  );
}

function Empty(props) {
  return (
    <>
      <label>無資料</label>
    </>
  );
}
