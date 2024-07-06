import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { toYYYYMMDDWithSeparator } from '../../utility/formatter';

import { FavoriteButton } from './FavoriteButton';
import { PostTabs } from './Tabs';
// import StockCard from './StockCard';

export function MyPostList(props) {
  const { data } = props;
  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const [useMini, setUseMini] = useState(true);
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag);

  return (
    <>
      <div style={{ position: 'relative', maxWidth: '450px', margin: 'auto' }}>
        <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
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
      </div>

      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((postInfo) => {
        const { processedData, historicalInfo, isRecentPost } = postInfo;
        const baseDateInfo = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};
        const hight = processedData.find((x) => x.type === 'highest');
        const latest = processedData.find((x) => x.type === 'latest');

        return useMini ? (
          <MiniPost post={postInfo} openNewPage={openNewPage} /> //<StockCard data={postInfo} />
        ) : (
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
              <>
                {hight && latest && baseDateInfo && (
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
                )}
              </>
            </div>
          </div>
        );
      })}
    </>
  );
}

function MiniPost(props) {
  const { post, openNewPage } = props;
  const latest = post.processedData.find((x) => x.type === 'latest');
  const baseDateInfo = post.historicalInfo[0];

  return (
    <div
      key={`${post.id}${post.batchNo}`}
      style={{
        maxWidth: '450px',
        margin: '0 auto 10px',
        padding: '5px 10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        position: 'relative',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          textAlign: 'center', // Center text horizontally
          cursor: 'pointer',
          display: 'flex', // Use flexbox
        }}
      >
        <FavoriteButton isFavorite={Boolean(post.isFavorite)} id={post.id} />
        <div style={{ padding: '0px 4px' }}></div>
        <div onClick={() => openNewPage(post.href)}>
          [{post.tag}] {post.title}👈
        </div>
      </div>
      <div style={{ display: 'inline-flex' }}>
        <div style={{ padding: '0px 16px' }}></div>
        <div>{baseDateInfo && baseDateInfo.close ? baseDateInfo.close.toFixed(2) : '-'}</div>
        <div style={{ padding: '0px 8px' }}>|</div>
        <div>{latest ? latest.price.toFixed(2) : '-'}</div>
        <div style={{ padding: '0px 8px' }}></div>
        <div>{latest ? `${latest.diff} (${latest.diffPercent}%)` : ''}</div>
      </div>
    </div>
  );
}
