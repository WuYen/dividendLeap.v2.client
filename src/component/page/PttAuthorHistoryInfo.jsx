import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../utility/api';
import TeaLoading from '../loading/TeaLoading';
import PageTitle from '../common/PageTitle';

export default function PttAuthorHistoryInfo() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    async function fetchData() {
      const refresh = searchParams.get('refresh');
      const response = await api.get(`/ptt/author/${id}?refresh=${refresh === 'true'}`);
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
  }, [id, navigate, searchParams]);

  const token = searchParams.get('token');
  const handleLikeClick = () => {
    api.get(`/ptt/author/${id}/like?token=${token}`);
  };

  return (
    <div className="App">
      <PageTitle titleText={`作者: ${id} [標的]`} />
      <div style={{ marginBottom: '20px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
      {token && <div onClick={handleLikeClick}>Like</div>}
      {isLoading ? <TeaLoading /> : data.length === 0 ? <Empty /> : <HistoryList data={data} />}
    </div>
  );
}

function HistoryList(props) {
  const { data } = props;
  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };
  return data.map((item) => {
    const { post, processedData, historicalInfo, isRecentPost } = item;
    const base = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};
    const processInfo = processedData && processedData.length ? processedData[0] : {};

    return (
      <div
        key={item.stockNo}
        style={{
          maxWidth: '450px',
          margin: '0 auto 30px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          position: 'relative',
        }}
      >
        {isRecentPost && (
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              backgroundColor: '#5bbcdb',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontWeight: 'bold',
            }}
          >
            新
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {/* row 1 */}
          <div
            onClick={() => openNewPage(post.href)}
            style={{
              gridColumn: '1 / span 3',
              textAlign: 'left',
              cursor: 'pointer',
              marginRight: isRecentPost ? '30px' : '0px',
            }}
          >
            [{post.tag}] {post.title}👈
          </div>
          {/* row 2 */}
          <div style={{ gridColumn: '1 / span 3', textAlign: 'left' }}>{formatDateToYYYYMMDD(post.id)}</div>
          {/* row 3 */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold' }}>交易日</label>
            <div>{base.date ? toYYYYMMDDWithSeparator(base.date) : '-'}</div>
            <div>{processInfo.date ? toYYYYMMDDWithSeparator(processInfo.date) : '-'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <label style={{ fontWeight: 'bold' }}>股價</label>
            <div>{base.close ? base.close.toFixed(2) : '-'}</div>
            <div>{processInfo.price ? processInfo.price.toFixed(2) : '-'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <label style={{ fontWeight: 'bold' }}>差異</label>
            <div>-</div>
            <div>
              {processInfo.diff} ({processInfo.diffPercent}%)
            </div>
          </div>
        </div>
      </div>
    );
  });
}

function formatDateToYYYYMMDD(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toYYYYMMDDWithSeparator(input, separator = '-') {
  if (typeof input == 'string') {
    return `${input.slice(0, 4)}${separator}${input.slice(4, 6)}${separator}${input.slice(6, 8)}`;
  } else {
    return `${input.getFullYear().toString()}${separator}${('0' + (input.getMonth() + 1)).slice(-2)}${separator}${(
      '0' + input.getDate()
    ).slice(-2)}`;
  }
}

function Empty(props) {
  return (
    <>
      <label>無資料</label>
    </>
  );
}
