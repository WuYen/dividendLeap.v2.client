import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams, useLocation, Link } from 'react-router-dom';

import api from '../../utility/api';
import TeaLoading from '../common/TeaLoading';
import { getLoginStatus } from './Login';

export default function MyPttContainer() {
  const [posts, setPosts] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [authorPosts, setAuthorPosts] = useState([]);

  return (
    <div className='App'>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <TopNavTab defaultTab='文章' />
              <FetchDataWrapper data={posts} onSetData={setPosts} generateUrl={() => '/my/posts'}>
                {({ data, ...otherArgs }) => {
                  return data.length === 0 ? <Empty /> : <StockList data={data} />;
                }}
              </FetchDataWrapper>
            </>
          }
        />
        <Route
          path='/posts'
          element={
            <>
              <TopNavTab defaultTab='My文章' />
              <FetchDataWrapper data={posts} onSetData={setPosts} generateUrl={() => '/my/posts/favorite'}>
                {({ data, ...otherArgs }) => {
                  return data.length === 0 ? <Empty /> : <StockList data={data} />;
                }}
              </FetchDataWrapper>
            </>
          }
        />
        <Route
          path='/authors'
          element={
            <>
              <TopNavTab defaultTab='作者' />
              <FetchDataWrapper data={authorList} onSetData={setAuthorList} generateUrl={({ data }) => '/ptt/authors'}>
                {({ data, ...otherArgs }) => {
                  return data.length === 0 ? <Empty /> : <AuthorList data={data} />;
                }}
              </FetchDataWrapper>
            </>
          }
        />
        <Route
          path='/author/:id'
          element={
            <>
              <FetchDataWrapper
                data={authorPosts}
                onSetData={setAuthorPosts}
                generateUrl={({ id, searchParams }) => {
                  const refresh = searchParams.get('refresh');
                  return `/ptt/author/${id}?refresh=${refresh === 'true'}`;
                }}
              >
                {({ data, ...otherArgs }) => {
                  return (
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        {`作者: ${otherArgs.id} 貼文`} <button onClick={otherArgs.onBack}>Go Back</button>
                      </div>
                      <div style={{ marginBottom: '20px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
                      {data.length === 0 ? <Empty /> : <HistoryList data={data} />}
                    </>
                  );
                }}
              </FetchDataWrapper>
            </>
          }
        />
      </Routes>
    </div>
  );
}

function FetchDataWrapper(props) {
  const { data, onSetData, generateUrl } = props;
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const prevPathname = useRef(location.pathname);
  const needLoading = isLoading || prevPathname.current !== location.pathname;
  const url = generateUrl({ data, id, searchParams });

  useEffect(() => {
    prevPathname.current = location.pathname;

    if (url) {
      setIsLoading(true);
      fetchData(url, onSetData, setIsLoading, navigate);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, navigate, onSetData, url]);

  const handleBack = () => {
    navigate(-1);
  };

  return <>{needLoading ? <TeaLoading /> : props.children({ data, id, onBack: handleBack })} </>;
}

async function fetchData(url, onSetData, setIsLoading, navigate) {
  if (url) {
    const response = await api.get(url);
    if (response.success) {
      if (response.data.posts) {
        onSetData(response.data.posts);
      } else {
        onSetData(response.data);
      }
      setIsLoading(false);
    } else {
      navigate('/error');
    }
  }
}

function PostTabs(props) {
  const { activeTag, onSetActiveTag, containTargetPosts } = props;
  const tagArray = containTargetPosts ? ['標的', '全部'] : ['全部']; //Array.from(tags).concat('全部');
  return <Tabs tagArray={tagArray} activeTag={activeTag} onTabClick={onSetActiveTag} />;
}

function Tabs(props) {
  const { tagArray, activeTag, onTabClick } = props;

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
              onChange={() => onTabClick(tag)}
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
                style={{
                  gridColumn: '1 / span 3',
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginRight: isRecentPost ? '30px' : '0px',
                }}
              >
                <div
                  style={{
                    gridColumn: '1 / span 2',
                    textAlign: 'center', // Center text horizontally
                    cursor: 'pointer',
                    display: 'flex', // Use flexbox
                    alignItems: 'center', // Center content vertically
                    columnGap: '10px',
                  }}
                >
                  <FavoriteButton isFavorite={Boolean(post.isFavorite)} id={post.id} />
                  <div onClick={() => openNewPage(post.href)}>
                    [{post.tag}] {post.title}👈
                  </div>
                </div>
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
                style={{
                  gridColumn: '1 / span 2',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    gridColumn: '1 / span 2',
                    textAlign: 'center', // Center text horizontally
                    cursor: 'pointer',
                    display: 'flex', // Use flexbox
                    alignItems: 'center', // Center content vertically
                    columnGap: '10px',
                  }}
                >
                  <FavoriteButton isFavorite={Boolean(post.isFavorite)} id={post.id} />
                  <div onClick={() => openNewPage(post.href)}>
                    [{post.tag}] {post.title}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                作者: <Link to={`/my/author/${post.author}`}>{post.author}</Link>
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
  const [, userInfo] = getLoginStatus();
  const [searchText, setSearchText] = useState();
  const navigate = useNavigate();
  const handleSearchClick = () => {
    if (searchText) {
      navigate(`/my/author/${searchText}`);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: '450px',
          margin: '0 auto 20px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '8fr 2fr',
            gap: '10px',
            alignItems: 'center',
            placeItems: 'center',
          }}
        >
          <input
            className='text-input'
            type='text'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            required={true}
            placeholder={'Search author'}
          />
          <button className='regis-button' style={{ width: '100%', maxWidth: '100%' }} onClick={handleSearchClick}>
            查詢
          </button>
        </div>
      </div>
      {data.map((item) => {
        return (
          <div
            key={item.name}
            style={{
              maxWidth: '450px',
              margin: '0 auto 20px',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              position: 'relative',
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</span>
            <span style={{ color: '#888', marginLeft: '10px', marginRight: '10px' }}>
              <button
                style={{ color: '#888', marginLeft: '10px', marginRight: '10px' }}
                onClick={(e) => {
                  e.stopPropagation(); // 防止事件繼續往上層傳遞
                  e.preventDefault();
                  api.get(`/my/author/${item.name}/like?token=${userInfo.id}`);
                }}
              >
                👍
              </button>
              {item.likes}
            </span>
            <span style={{ color: '#888', marginLeft: '10px', marginRight: '10px' }}>
              <button
                style={{ color: '#888', marginLeft: '10px', marginRight: '10px' }}
                onClick={(e) => {
                  e.stopPropagation(); // 防止事件繼續往上層傳遞
                  e.preventDefault();
                  navigate(`/my/author/${item.name}`);
                }}
              >
                Detail
                {/* <Link to={`/my/author/${item.name}`}>Detail</Link> */}
              </button>
            </span>
          </div>
        );
      })}
    </>
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

function TopNavTab(props) {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState(props.defaultTab);
  return (
    <div style={{ marginBottom: '20px' }}>
      <Tabs
        tagArray={['文章', 'My文章', '作者']}
        activeTag={activeTag}
        onTabClick={(tag) => {
          setActiveTag(tag);
          if (tag === '文章') {
            navigate('/my');
          } else if (tag === '作者') {
            navigate('/my/authors');
          } else if (tag === 'My文章') {
            navigate('/my/posts');
          }
        }}
      />
    </div>
  );
}

const FavoriteButton = (props) => {
  const [isFavorite, setIsFavorite] = useState(props.isFavorite);

  const handleClick = async () => {
    //api call
    setIsFavorite(!isFavorite);
    const response = await api.get(`/my/post/${props.id}/favorite`);
    if (!response.success) {
      setIsFavorite(!isFavorite);
      alert('收藏失敗');
    }
  };

  return (
    <svg
      onClick={handleClick}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill={isFavorite ? '#ffe5ae' : 'none'}
      stroke={isFavorite ? 'gold' : 'gray'}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ cursor: 'pointer', width: '24px', height: '24px' }}
    >
      <polygon points='12 2 15 8.7 22 9.2 17 14.1 18.5 21 12 17.5 5.5 21 7 14.1 2 9.2 9 8.7 12 2' />
    </svg>
  );
};

// function AddPostToWatchList(props) {
//   const { post, userInfo } = props;

//   return (
//     <button
//       style={{ color: '#888', marginLeft: '10px', marginRight: '10px' }}
//       onClick={(e) => {
//         if (isLoggedIn) {
//           e.stopPropagation(); // 防止事件繼續往上層傳遞
//           api.get(`/ptt/author/${item.name}/like?token=${userInfo.id}`);
//         }
//       }}
//     ></button>
//   );
// }
