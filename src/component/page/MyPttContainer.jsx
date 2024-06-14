import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams, useLocation, Link } from 'react-router-dom';

import api from '../../utility/api';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';

import TeaLoading from '../common/TeaLoading';

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
                  return data.length === 0 ? <Empty /> : <PostList data={data} />;
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
                  return data.length === 0 ? <Empty /> : <HistoryList data={data} isMyList={true} />;
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
                      <div style={headerStyles.container}>
                        <div style={headerStyles.arrowContainer} onClick={otherArgs.onBack}>
                          <BackButton /> BACK
                        </div>
                        <div style={headerStyles.text}>作者: {otherArgs.id} 貼文</div>
                      </div>
                      <div style={{ marginBottom: '10px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
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

const headerStyles = {
  container: {
    maxWidth: '450px',
    margin: '0 auto 15px', // Centering with margin auto and adding bottom margin
    position: 'relative',
  },
  arrowContainer: {
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    display: 'flex',
    borderRadius: '99px',
    border: '1px solid #ccc',
    padding: '4px 12px 4px 4px',
  },
  backButton: {
    width: '24px',
    height: '24px',
  },
  text: {
    fontSize: '20px',
    textAlign: 'center',
    paddingLeft: '24px', // To ensure text doesn't overlap with the back button
    paddingRight: '24px', // Optional: if you want some space on the right side as well
  },
};
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
            <input type='radio' id={`radio-${tag}`} name='tabs' checked={activeTag === tag} onChange={() => onTabClick(tag)} />
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
  const { data, isMyList } = props;
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
      {filteredData.map((postInfo) => {
        const { processedData, historicalInfo, isRecentPost } = postInfo;
        const baseDateInfo = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};
        let hight = processedData && processedData.length ? processedData[0] : {};
        let latest = {};
        if (isMyList && processedData && processedData.length) {
          hight = processedData.find((x) => x.type === 'highest');
          latest = processedData.find((x) => x.type === 'latest');
        }

        return (
          <div
            key={`${postInfo.id}${postInfo.batchNo}`}
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
                    gridColumn: '1 / span 3',
                    textAlign: 'center', // Center text horizontally
                    cursor: 'pointer',
                    display: 'flex', // Use flexbox
                    alignItems: 'center', // Center content vertically
                    columnGap: '10px',
                  }}
                >
                  <FavoriteButton isFavorite={Boolean(postInfo.isFavorite)} id={postInfo.id} />
                  <div onClick={() => openNewPage(postInfo.href)}>
                    [{postInfo.tag}] {postInfo.title}👈
                  </div>
                </div>
              </div>
              {/* row 2 */}

              {isMyList ? (
                <div
                  style={{
                    gridColumn: '1 / span 3',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    作者: <Link to={`/my/author/${postInfo.author}`}>{postInfo.author}</Link>
                  </div>
                  <div>日期: {toYYYYMMDDWithSeparator(new Date(postInfo.id * 1000))}</div>
                </div>
              ) : (
                <div style={{ gridColumn: '1 / span 3', textAlign: 'left' }}>{toYYYYMMDDWithSeparator(new Date(postInfo.id * 1000))}</div>
              )}

              {isMyList ? (
                <>
                  {/* row 3 */}
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontWeight: 'bold' }}>基準日</label>
                    <div>{baseDateInfo.date ? toYYYYMMDDWithSeparator(baseDateInfo.date) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>股價</label>
                    <div>{baseDateInfo.close ? baseDateInfo.close.toFixed(2) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>差異</label>
                    <div>-</div>
                  </div>
                  {/* row 4 */}
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontWeight: 'bold' }}>四個月內最高</label>
                    <div>{hight.date ? `${toYYYYMMDDWithSeparator(hight.date)}` : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>股價</label>
                    <div>{hight.price ? hight.price.toFixed(2) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>差異</label>
                    <div>
                      {hight.diff} ({hight.diffPercent}%)
                    </div>
                  </div>
                  {/* row 5 */}
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontWeight: 'bold' }}>最近交易日</label>
                    <div>{latest.date ? `${toYYYYMMDDWithSeparator(latest.date)}` : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>股價</label>
                    <div>{latest.price ? latest.price.toFixed(2) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>差異</label>
                    <div>
                      {latest.diff} ({latest.diffPercent}%)
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontWeight: 'bold' }}>交易日</label>
                    <div>{baseDateInfo.date ? toYYYYMMDDWithSeparator(baseDateInfo.date) : '-'}</div>
                    <div>{hight.date ? toYYYYMMDDWithSeparator(hight.date) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>股價</label>
                    <div>{baseDateInfo.close ? baseDateInfo.close.toFixed(2) : '-'}</div>
                    <div>{hight.price ? hight.price.toFixed(2) : '-'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontWeight: 'bold' }}>差異</label>
                    <div>-</div>
                    <div>
                      {hight.diff} ({hight.diffPercent}%)
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

function PostList(props) {
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
              <div style={{ textAlign: 'left' }}>日期: {toYYYYMMDDWithSeparator(new Date(post.id * 1000))}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function AuthorList(props) {
  const { data } = props;
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
          <input className='text-input' type='text' value={searchText} onChange={(e) => setSearchText(e.target.value)} required={true} placeholder={'Search author'} />
          <button className='regis-button' style={{ width: '100%', maxWidth: '100%' }} onClick={handleSearchClick}>
            查詢
          </button>
        </div>
      </div>
      {data.map((item) => (
        <AuthorListItem key={item.name} authoInfo={item} navigate={navigate} />
      ))}
    </>
  );
}

function Empty(props) {
  return (
    <>
      <label>無資料</label>
    </>
  );
}

export function TopNavTab(props) {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState(props.defaultTab);
  return (
    <div style={{ marginBottom: '10px' }}>
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

const AuthorListItem = (props) => {
  const { authoInfo, navigate } = props;
  const handleArrowClick = (e) => {
    e.stopPropagation(); // 防止事件繼續往上層傳遞
    e.preventDefault();
    navigate(`/my/author/${authoInfo.name}`);
  };
  const handleLikeClick = (e) => {
    // e.stopPropagation(); // 防止事件繼續往上層傳遞
    // e.preventDefault();
    // api.get(`/my/author/${item.name}/like?token=${userInfo.id}`);
  };
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <div style={styles.headerContainer}>
          <div style={styles.likeContainer} onClick={(e) => handleLikeClick(e)}>
            <ThumbUpIcon />
            <span style={styles.likeCount}> {authoInfo.likes}</span>
          </div>
          <div style={styles.text}>{authoInfo.name}</div>
        </div>
      </div>
      <div style={styles.arrowContainer} onClick={(e) => handleArrowClick(e)}>
        <ArrowIcon />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: '0px auto 20px',
    maxWidth: '450px',
    textAlign: 'left',
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginLeft: '8px',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  likeContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: '12px',
    marginLeft: '8px',
  },
  likeCount: {
    marginLeft: '4px',
    fontSize: '16px',
    paddingTop: '2px',
    color: 'gray',
  },
  thumbUpIcon: {
    width: '20px',
    height: '20px',
  },
};

const ArrowIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' height='24px' fill='currentColor'>
    <path fillRule='evenodd' d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z' clipRule='evenodd' />
  </svg>
);

const ThumbUpIcon = () => (
  <svg width='24px' height='24px' viewBox='0 0 1024.00 1024.00' className='icon' version='1.1' xmlns='http://www.w3.org/2000/svg' fill='#000000'>
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M601.5 531.8h278.8v16H601.5zM639.3 657.4h224v16h-224zM686.8 779h160.8v16H686.8z' fill='#F73737'></path>
      <path
        d='M216.3 927.8H62.2V425.6h155.4l-1.3 502.2z m-110.1-44h66.2l1.1-414.2h-67.3v414.2zM822.1 927.8H268.9l-0.4-502L633.3 96.2l85.2 91.5-66.8 196.7h310L822.1 927.8z m-509.3-44H788l117-455.4H655.8l-65.5-0.1 78.1-229.9-37.8-40.5-318.1 287.4 0.3 438.5z'
        fill='#353535'
      ></path>
    </g>
  </svg>
);

const BackButton = () => (
  <svg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='#000000'>
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <title></title>
      <g id='Complete'>
        <g id='F-Chevron'>
          <polyline fill='none' id='Left' points='15.5 5 8.5 12 15.5 19' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'></polyline>
        </g>
      </g>
    </g>
  </svg>
);
