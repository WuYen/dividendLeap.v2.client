import { useEffect, useState } from 'react';
import api from '../../utility/api';
import TeaLoading from '../loading/TeaLoading';
import { useParams, useNavigate } from 'react-router-dom';

export default function PttAuthorHistoryInfo() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const response = await api.get(`/ptt/author/${id}`);
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

  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };

  return (
    <div className="App">
      <h1 style={{ marginTop: '40px', marginBottom: '40px' }}>作者: {id} [標的]</h1>
      <hr style={{ margin: 'auto', width: '40%' }} />
      <div
        style={{
          marginBlockStart: '1em',
          marginBlockEnd: '1em',
          marginInlineStart: '0px',
          marginInlineEnd: '0px',
        }}
      >
        {isLoading ? (
          <TeaLoading />
        ) : data.length === 0 ? (
          <Empty />
        ) : (
          data.map((item) => {
            const { post, processedData, historicalInfo } = item;
            const highestPrice = processedData && processedData.length ? processedData[0] : {};
            const base = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};

            return (
              <div
                key={item.stockNo}
                style={{
                  maxWidth: '450px',
                  margin: '0 auto 30px',
                  padding: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {/* row 1 */}
                  <div
                    onClick={() => openNewPage(post.href)}
                    style={{ gridColumn: '1 / span 3', textAlign: 'left', cursor: 'pointer' }}
                  >
                    [{post.tag}] {post.title}👈
                  </div>
                  {/* row 2 */}
                  <div style={{ gridColumn: '1 / span 3', textAlign: 'left' }}>{formatDateToYYYYMMDD(post.id)}</div>
                  {/* row 3 */}
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontWeight: 'bold' }}>交易日</label>
                    <div>{base.date ? toYYYYMMDDWithSeparator(base.date) : '-'}</div>
                    <div>{highestPrice.date ? toYYYYMMDDWithSeparator(highestPrice.date) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>股價</label>
                    <div>{base.close ? base.close.toFixed(2) : '-'}</div>
                    <div>{highestPrice.price ? highestPrice.price.toFixed(2) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>差異</label>
                    <div>-</div>
                    <div>
                      {highestPrice.diff} ({highestPrice.diffPercent}%)
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
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
