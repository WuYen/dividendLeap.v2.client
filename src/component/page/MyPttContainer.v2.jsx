import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecoilValue, RecoilRoot, useSetRecoilState, useRecoilState } from 'recoil';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import api from '../../utility/api';
import { postsState, favoritesState, authorPostsState, authorsRankState } from '../../state/atoms';
import { PostList } from '../common/PostList';
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
          <Route path='/authors/rank' element={<AuthorRankPage />} />
          <Route path='/author/:id' element={<AuthorPostsPage />} />
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
      <PostList data={favorites.posts} mini={true} tagFilter={false} />
    </>
  );
}

function AuthorRankPage(props) {
  const authorsRank = useRecoilValue(authorsRankState);
  return (
    <>
      <TopNavTab defaultTab='作者' />
      <AuthorList data={authorsRank} />
    </>
  );
}

function AuthorPostsPage(props) {
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
      <Box
        sx={{
          maxWidth: '450px',
          margin: '0 auto 15px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            left: 0,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          size='small'
        >
          <ArrowBackIcon fontSize='small' />
        </IconButton>
        <Typography
          variant='h6'
          sx={{
            textAlign: 'center',
            px: 3,
          }}
        >
          作者: {id} 貼文
        </Typography>
      </Box>
      <PostList data={authorPosts} />
    </>
  );
}

function TopNavTab(props) {
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
            navigate('/my', { replace: true });
          } else if (tag === '作者') {
            navigate('/my/authors/rank', { replace: true });
          } else if (tag === 'My文章') {
            navigate('/my/posts', { replace: true });
          }
        }}
      />
    </div>
  );
}

const DataLoader = (props) => {
  const [loading, setLoading] = useState(true);
  const setPosts = useSetRecoilState(postsState);
  const setFavorites = useSetRecoilState(favoritesState);
  const setAuthorsRank = useSetRecoilState(authorsRankState);

  useEffect(() => {
    // Fetch data from API or data source
    const fetchData = async () => {
      const [posts, rank] = await Promise.all([api.get('/my/posts'), api.get('/my/authors/rank')]);

      setPosts(posts.data);
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
  }, [setPosts, setFavorites, setLoading, setAuthorsRank]);

  return loading ? <TeaLoading /> : props.children;
};
