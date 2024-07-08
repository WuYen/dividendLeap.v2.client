import React, { useState } from 'react';
import { PostTabs } from './Tabs';
import StockCard from './StockCard';

export function PostList(props) {
  const { data } = props;
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag);
  return (
    <>
      <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((post) => {
        return <StockCard key={`${post.id}${post.batchNo}`} data={{ ...post, isRecentPost: true }} />; //openNewPage={openNewPage}
      })}
    </>
  );
}
