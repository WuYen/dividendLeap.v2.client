import React, { useState } from 'react';

import { toYYYYMMDDWithSeparator } from '../../utility/formatter';
import { PostTabs } from './Tabs';
import StockChart from './StockChart';

export function HistoryList(props) {
  const { data } = props;
  const openNewPage = (path) => {
    const url = `https://www.ptt.cc/${path}`;
    window.open(url, '_blank');
  };
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const filteredData = activeTag === '全部' ? data : data.filter((item) => item.tag === activeTag);

  return (
    <>
      <PostTabs containTargetPosts={containTargetPosts} activeTag={activeTag} onSetActiveTag={setActiveTag} />
      <div style={{ marginBottom: '20px' }}></div>
      {filteredData.map((postInfo) => {
        const { processedData, historicalInfo, isRecentPost } = postInfo;
        const baseDateInfo = historicalInfo && historicalInfo.length ? historicalInfo[0] : {};
        let hight = processedData && processedData.length ? processedData[0] : {};

        return (
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
              <div style={{ gridColumn: '1 / span 3', textAlign: 'left' }}>{toYYYYMMDDWithSeparator(new Date(postInfo.id * 1000))}</div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontWeight: 'bold' }}>交易日</label>
                <div>{baseDateInfo.date ? toYYYYMMDDWithSeparator(baseDateInfo.date) : '-'}</div>
                <div>{hight.date ? toYYYYMMDDWithSeparator(hight.date) : '-'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <label style={{ fontWeight: 'bold' }}>股價</label>
                <div>{baseDateInfo.close ? baseDateInfo.close.toFixed(2) : '-'}</div>
                <div>{hight.price ? hight.price.toFixed(2) : '-'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <label style={{ fontWeight: 'bold' }}>差異</label>
                <div>-</div>
                <div>
                  {hight.diff} ({hight.diffPercent}%)
                </div>
              </div>
              {/* row 3 */}
              <div style={{ gridColumn: '1 / span 3' }}>
                <StockChart rawData={historicalInfo} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

const FavoriteButton = (props) => {
  const [isFavorite, setIsFavorite] = useState(props.isFavorite);

  const handleClick = async () => {
    setIsFavorite(!isFavorite);
    const response = await api.get(`/my/post/${props.id}/favorite`);
    if (!response.success) {
      setIsFavorite(!isFavorite);
      alert('收藏失敗');
    }
  };

  return (
    <svg
      onClick={handleClick}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill={isFavorite ? '#ffe5ae' : 'none'}
      stroke={isFavorite ? 'gold' : 'gray'}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ cursor: 'pointer', width: '24px', height: '24px' }}
    >
      <polygon points='12 2 15 8.7 22 9.2 17 14.1 18.5 21 12 17.5 5.5 21 7 14.1 2 9.2 9 8.7 12 2' />
    </svg>
  );
};
