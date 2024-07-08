import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { toYYYYMMDDWithSeparator } from '../../utility/formatter';
import { FavoriteButton } from './FavoriteButton';
import { PostTabs } from './Tabs';

const openNewPage = (path) => {
  const url = `https://www.ptt.cc/${path}`;
  window.open(url, '_blank');
};

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
        return <PostInfoCard key={`${post.id}${post.batchNo}`} post={post} openNewPage={openNewPage} />;
      })}
    </>
  );
}

function PostInfoCard({ post, openNewPage }) {
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
}
