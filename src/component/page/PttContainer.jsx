import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

import api from '../../utility/api';
import TeaLoading from '../common/TeaLoading';
import PageTitle from '../common/PageTitle';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';

export default function PttContainer() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const prevPathname = useRef(location.pathname);
  const refresh = searchParams.get('refresh');
  const url = `/ptt/author/${id}?refresh=${refresh === 'true'}`;

  useEffect(() => {
    async function fetchData() {
      if (url) {
        const response = await api.get(url);
        console.log('fetch data', url, response);
        if (response.success) {
          setData(response.data);
          setIsLoading(false);
        } else {
          navigate('/error');
        }
      }
    }
    fetchData();
  }, [url, navigate]);

  useEffect(() => {
    prevPathname.current = location.pathname;
  }, [location.pathname]);

  const needLoading = prevPathname.current !== location.pathname;

  return (
    <div className='App'>
      <PageTitle titleText={`作者: ${id} 貼文`} />
      <div style={{ marginBottom: '20px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
      {isLoading || needLoading ? (
        <TeaLoading />
      ) : data.length === 0 ? (
        <label>無資料</label>
      ) : (
        <HistoryList data={data} />
      )}
    </div>
  );
}

function PostTabs(props) {
  const { activeTag, onSetActiveTag, containTargetPosts } = props;

  const tagArray = containTargetPosts ? ['標的', '全部'] : ['全部']; //Array.from(tags).concat('全部');
  return (
    <div className='container'>
      <div className='tabs'>
        {tagArray.map((tag) => (
          <React.Fragment key={tag}>
            <input
              type='radio'
              id={`radio-${tag}`}
              name='tabs'
              checked={activeTag === tag}
              onChange={() => onSetActiveTag(tag)}
            />
            <label className={`tab ${activeTag === tag ? 'active' : ''}`} htmlFor={`radio-${tag}`}>
              {tag}
            </label>
          </React.Fragment>
        ))}
        <span
          className='glider'
          style={{
            transform: `translateX(${(tagArray.indexOf(activeTag) - 1) * 100 + 100}%)`,
          }}
        ></span>
      </div>
    </div>
  );
}

function HistoryList(props) {
  const { data } = props;
  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag);

  return (
    <>
      <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((post) => {
        const { processedData, historicalInfo, isRecentPost } = post;
        const base = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};
        const processInfo = processedData && processedData.length ? processedData[0] : {};

        return (
          <div
            key={`${post.id}${post.batchNo}`}
            style={{
              maxWidth: '450px',
              margin: '0 auto 20px',
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
              }}
            >
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
              <div style={{ gridColumn: '1 / span 3', textAlign: 'left' }}>
                {toYYYYMMDDWithSeparator(new Date(post.id * 1000))}
              </div>
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
      })}
    </>
  );
}
