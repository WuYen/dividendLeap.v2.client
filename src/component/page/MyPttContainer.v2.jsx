import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRecoilValue, RecoilRoot, useSetRecoilState } from 'recoil';

import api from '../../utility/api';
import { postsState, authorsState, favoritesState } from '../../state/atoms';
import { PostList } from '../common/PostList';
import { HistoryList } from '../common/HistoryList';
import { AuthorList } from '../common/AuthorList';
import { MyPostList } from '../common/MyPostList';
import { TopNavTab } from './MyPttContainer';

export default function MyPttContainer() {
  return (
    <div className='App'>
      <RecoilRoot>
        <DataLoader>
          <Routes>
            <Route path='/' element={<PostListPage />} />
            <Route path='/posts' element={<MyPostListPage />} />
            <Route path='/authors' element={<AuthorListPage />} />
            <Route path='/author/:id' element={<HistoryListPage />} />
          </Routes>
        </DataLoader>
      </RecoilRoot>
    </div>
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
  const favorite = useRecoilValue(favoritesState);
  return (
    <>
      <TopNavTab defaultTab='My文章' />
      <MyPostList data={favorite.posts} />
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

function HistoryListPage(props) {
  //TODO:add an atom of this page data, fetch data
  //const authors = useRecoilValue(authorsState);
  const headerStyles = {};
  const handleBack = () => {};
  const author = '';
  return (
    <>
      <div style={headerStyles.container}>
        <div style={headerStyles.arrowContainer} onClick={handleBack}>
          back
        </div>
        <div style={headerStyles.text}>作者: {author} 貼文</div>
      </div>
      <div style={{ marginBottom: '10px' }}>📢 顯示發文後四個月內最高點(不包含新貼文)</div>
      <HistoryList data={[]} />
    </>
  );
}

const DataLoader = (props) => {
  //一口氣拉三個資料
  const setPosts = useSetRecoilState(postsState);
  const setAuthors = useSetRecoilState(authorsState);
  const setFavoriteItems = useSetRecoilState(favoritesState);

  useEffect(() => {
    // Fetch data from API or data source
    const fetchData = async () => {
      const [posts, authors, myPosts] = await Promise.all([api.get('/my/posts'), api.get('/ptt/authors'), api.get('/my/posts/favorite')]);
      debugger;
      setPosts(posts.data);
      setAuthors(authors.data);
      setFavoriteItems({ posts: myPosts.data });
    };

    fetchData();
  }, [setPosts, setAuthors, setFavoriteItems]);

  return props.children;
};
