import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../utility/api';
import TeaLoading from '../loading/TeaLoading';
import PageTitle from '../common/PageTitle';
import { isLoggedIn } from './Login';
import './tab.css'; // 將 CSS 檔案引入

export default function PttContainer() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const prevPathname = useRef(location.pathname);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const { url, List, pageTitleComponent } = useMemo(() => {
    let url = '';
    let List = null;
    let pageTitleComponent = null;

    switch (location.pathname) {
      case '/ptt':
        url = '/ptt/list';
        List = StockList;
        pageTitleComponent = <PageTitle titleText={'Stock Board'} />;
        break;
      case '/ptt/author/list':
        url = '/ptt/author/list';
        List = AuthorList;
        pageTitleComponent = <PageTitle titleText={'作者列表'} />;
        break;
      default:
        const refresh = searchParams.get('refresh');
        url = `/ptt/author/${id}?refresh=${refresh === 'true'}`;
        List = HistoryList;
        pageTitleComponent = (
          <>
            <PageTitle titleText={`作者: ${id} 貼文`} />
            <div style={{ marginBottom: '20px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
          </>
        );
        break;
    }

    return { url, List, pageTitleComponent };
  }, [location.pathname, id, searchParams]);

  useEffect(() => {
    async function fetchData() {
      if (url) {
        const response = await api.get(url);
        console.log('fetch data', url, response);
        if (response.success) {
          if (response.data.posts) {
            setData(response.data.posts);
          } else {
            setData(response.data);
          }
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
      {pageTitleComponent}
      {isLoading || needLoading ? (
        <TeaLoading />
      ) : data.length === 0 ? (
        <Empty />
      ) : (
        <List data={data} loggedIn={loggedIn} />
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
  const { data, loggedIn } = props;
  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };
  const containTargetPosts = data.find((item) => item.post.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.post.tag === activeTag);

  return (
    <>
      <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((item) => {
        const { post, processedData, historicalInfo, isRecentPost } = item;
        const base = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};
        const processInfo = processedData && processedData.length ? processedData[0] : {};

        return (
          <div
            key={`${item.post.id}${item.post.batchNo}`}
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
                [{post.tag}] {post.title}👈{' '}
                {loggedIn && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 防止事件繼續往上層傳遞
                      const token = localStorage.getItem('token');
                      const decoded = jwtDecode(token);
                      api.get(`/ptt/author/${post.author}/like?token=${decoded.id}`);
                    }}
                  >
                    like
                  </button>
                )}
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
      })}
    </>
  );
}

function StockList(props) {
  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };
  const { data } = props;
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag);
  return (
    <>
      <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((post) => {
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
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
              <div style={{ textAlign: 'left' }}>
                作者: <Link to={`/ptt/author/${post.author}`}>{post.author}</Link>
              </div>
              <div style={{ textAlign: 'left' }}>日期: {post.date}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function AuthorList(props) {
  const { data } = props;
  return data.map((item) => {
    return (
      <div
        key={item.name}
        style={{
          maxWidth: '450px',
          margin: '0 auto 20px',
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
