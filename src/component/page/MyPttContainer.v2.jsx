import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecoilValue, RecoilRoot, useSetRecoilState, useRecoilState } from 'recoil';

import api from '../../utility/api';
import { postsState, authorsState, favoritesState, authorPostsState, authorsRankState } from '../../state/atoms';
import { PostList } from '../common/PostList';
import { HistoryList } from '../common/HistoryList';
import { AuthorList } from '../common/AuthorList';
import Tabs from '../common/Tabs';
import TeaLoading from '../common/TeaLoading';

export default function MyPttContainer() {
  return (
    <RecoilRoot>
      <DataLoader>
        <Routes>
          <Route path='/' element={<PostListPage />} />
          <Route path='/posts' element={<MyPostListPage />} />
          <Route path='/authors' element={<AuthorListPage />} />
          <Route path='/authors/rank' element={<AuthorRankPage />} />
          <Route path='/author/:id' element={<HistoryListPage />} />
        </Routes>
      </DataLoader>
    </RecoilRoot>
  );
}

function PostListPage(props) {
  const posts = useRecoilValue(postsState);
  return (
    <>
      <TopNavTab defaultTab='文章' />
      <PostList data={posts} />
    </>
  );
}

function MyPostListPage(props) {
  const favorites = useRecoilValue(favoritesState);

  return favorites.loading ? (
    <TeaLoading />
  ) : (
    <>
      <TopNavTab defaultTab='My文章' />
      <PostList data={favorites.posts} showSwitch={true} />
    </>
  );
}

function AuthorListPage(props) {
  const authors = useRecoilValue(authorsState);
  return (
    <>
      <TopNavTab defaultTab='作者' />
      <AuthorList data={authors} />
    </>
  );
}

function AuthorRankPage(props) {
  const authorsRank = useRecoilValue(authorsRankState);
  return (
    <>
      <TopNavTab defaultTab='排名' />
      <AuthorList data={authorsRank} />
    </>
  );
}

function HistoryListPage(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [authorPosts, setAuthorPostsState] = useRecoilState(authorPostsState);

  useEffect(() => {
    // Fetch data from API or data source
    const fetchData = async () => {
      const refresh = searchParams.get('refresh');
      const url = `/ptt/author/${id}?refresh=${refresh === 'true'}`;

      const posts = await api.get(url);
      setAuthorPostsState(posts.data);
    };

    fetchData();
    return () => {
      setAuthorPostsState([]);
    };
  }, [id, searchParams, setAuthorPostsState]);

  const handleBack = () => {
    navigate(-1);
  };

  return authorPosts.length === 0 ? (
    <TeaLoading />
  ) : (
    <>
      <div
        style={{
          maxWidth: '450px',
          margin: '0 auto 15px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            display: 'flex',
            borderRadius: '99px',
            border: '1px solid #ccc',
            padding: '4px 12px',
          }}
          onClick={handleBack}
        >
          Back
        </div>
        <div
          style={{
            fontSize: '20px',
            textAlign: 'center',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          作者: {id} 貼文
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
      <HistoryList data={authorPosts} />
    </>
  );
}

function TopNavTab(props) {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState(props.defaultTab);
  return (
    <div style={{ marginBottom: '10px' }}>
      <Tabs
        tagArray={['文章', 'My文章', '作者', '排名']}
        activeTag={activeTag}
        onTabClick={(tag) => {
          setActiveTag(tag);
          if (tag === '文章') {
            navigate('/my');
          } else if (tag === '作者') {
            navigate('/my/authors');
          } else if (tag === 'My文章') {
            navigate('/my/posts');
          } else if (tag === '排名') {
            navigate('/my/authors/rank');
          }
        }}
      />
    </div>
  );
}

const DataLoader = (props) => {
  const [loading, setLoading] = useState(true);
  const setPosts = useSetRecoilState(postsState);
  const setAuthors = useSetRecoilState(authorsState);
  const setFavorites = useSetRecoilState(favoritesState);
  const setAuthorsRank = useSetRecoilState(authorsRankState);

  useEffect(() => {
    // Fetch data from API or data source
    const fetchData = async () => {
      const [posts, authors, rank] = await Promise.all([api.get('/my/posts'), api.get('/ptt/authors'), api.get('/my/authors/rank')]);

      setPosts(posts.data);
      setAuthors(authors.data);
      setAuthorsRank(rank.data);
      setLoading(false);
    };

    fetchData();

    // 單獨處理慢速請求
    setFavorites((prev) => ({ ...prev, loading: true }));
    api
      .get('/my/posts/favorite')
      .then((myPosts) => {
        setFavorites((prev) => ({
          ...prev,
          posts: myPosts.data,
          loading: false,
        }));
      })
      .catch((error) => {
        console.error('Error fetching favorite posts:', error);
        setFavorites((prev) => ({ ...prev, loading: false }));
      });
  }, [setPosts, setAuthors, setFavorites, setLoading, setAuthorsRank]);

  return loading ? <TeaLoading /> : props.children;
};
