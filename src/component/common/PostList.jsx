import React, { useState } from 'react';
import { PostTabs } from './Tabs';
import StockCard from './StockCard';

export function PostList(props) {
  const { data, mini = false, tagFilter = true } = props;
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');

  const filteredData = tagFilter ? (activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag)) : data;

  return (
    <>
      {tagFilter && (
        <>
          <div style={{ position: 'relative', maxWidth: '450px', margin: 'auto' }}>
            <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
          </div>
        </>
      )}
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((postInfo) => (
        <StockCard key={postInfo.id} post={postInfo} mini={mini} />
      ))}
    </>
  );
}
