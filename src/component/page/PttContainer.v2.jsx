import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState, useRecoilState, selector } from 'recoil';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import api from '../../utility/api';
import { postsState, favoritesState, authorPostsState, authorsRankState } from '../../state/atoms';
import { PostList } from '../common/PostList';
import { AuthorList } from '../common/AuthorList';
import Tabs from '../common/Tabs';
import TeaLoading from '../common/TeaLoading';

const pttContainerSelector = selector({
  key: 'pttContainerSelector',
  get: ({ get }) => {
    const posts = get(postsState);
    const favorites = get(favoritesState);
    const authorsRank = get(authorsRankState);

    return { posts, favorites, authorsRank };
  },
});

export default function PttContainer() {
  const location = useLocation();
  const { posts, favorites, authorsRank } = useRecoilValue(pttContainerSelector);

  let content;
  let defaultTab;
  switch (location.pathname) {
    case '/my/posts':
      content = favorites.loading ? <TeaLoading /> : <PostList data={favorites.posts} mini={true} tagFilter={false} isMyPost={true} />;
      defaultTab = 'My文章';
      break;
    case '/my/authors/rank':
      content = <AuthorList data={authorsRank} />;
      defaultTab = '作者';
      break;
    case '/my':
    default:
      content = <PostList data={posts} showSearch={true} tagFilter={false} />;
      defaultTab = '文章';
      break;
  }

  return (
    <>
      <TopNavTab defaultTab={defaultTab} />
      {content}
    </>
  );
}

export function AuthorPostsPage(props) {
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
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(`/my`, { replace: true });
    }
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

export const DataLoader = (props) => {
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

  console.log(`DataLoader loading:${loading}`);

  return loading ? <TeaLoading /> : props.children;
};
