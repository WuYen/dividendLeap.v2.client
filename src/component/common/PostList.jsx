import React, { useState } from 'react';
import { PostTabs } from './Tabs';
import StockCard from './StockCard';
import MyStockCard from './StockCard.v2';
import { PostSearchBar } from './PostSearchBar';
import api from '../../utility/api';

export function PostList(props) {
  const { data, mini = false, tagFilter = true, showSearch = false, isMyPost = false } = props;
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const tagArray = containTargetPosts ? ['標的', '全部'] : ['全部'];
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const [searchData, setSearchData] = useState(null);

  const filteredData = searchData || (activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag));

  const handleSearchTextChange = (searchText) => {
    if (!searchText) {
      setSearchData(null);
    } else {
      const filtered = data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
      setSearchData(filtered);
    }
  };

  const handleSearchClick = async (searchText) => {
    try {
      const response = await api.get(`/my/posts/search?search=${encodeURIComponent(searchText)}`);
      if (!response.success) {
        throw new Error('Search request failed');
      }
      setSearchData(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <>
      {tagFilter && (
        <>
          <div style={{ position: 'relative', maxWidth: '450px', margin: 'auto' }}>
            <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
          </div>
        </>
      )}
      {showSearch && (
        <PostSearchBar
          onSearchTextChange={handleSearchTextChange}
          onSearchClick={handleSearchClick}
          tags={tagArray}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      )}
      <div style={{ marginBottom: '10px' }}></div>
      {filteredData.map((postInfo, index) =>
        isMyPost ? (
          <MyStockCard key={`${postInfo.id}${index}`} post={postInfo} />
        ) : (
          <StockCard key={`${postInfo.id}${index}`} post={postInfo} mini={mini} />
        )
      )}
    </>
  );
}
