import React, { useState } from 'react';
import { PostTabs } from './Tabs';
import StockCard, { MiniStockCard } from './StockCard';

export function PostList(props) {
  const { data, showSwitch = false } = props;
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const [useMini, setUseMini] = useState(showSwitch);
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag);

  return (
    <>
      <div style={{ position: 'relative', maxWidth: '450px', margin: 'auto' }}>
        <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
        {showSwitch && (
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
            onClick={() => {
              setUseMini((x) => !x);
            }}
          >
            切換
          </div>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((postInfo) => {
        return useMini ? <MiniStockCard post={postInfo} /> : <StockCard data={postInfo} />;
      })}
    </>
  );
}
