import React, { useState, useEffect } from 'react';

const List = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ItemComponentDesktop = ({ itemData }) => (
    <div className='item-desktop'>
      <div className='item-col item-col-left'>{itemData.column1}</div>
      <div className='item-col item-col-right'>{itemData.column2}</div>
      <div className='item-col item-col-left'>{itemData.column3}</div>
      <div className='item-col item-col-right'>{itemData.column4}</div>
      <div className='item-col item-col-left'>{itemData.column5}</div>
    </div>
  );

  const ItemComponentMobile = ({ itemData }) => (
    <div className='item-mobile'>
      <div className='item-col item-col-left'>{itemData.column1}</div>
      <div className='item-col item-col-right'>{itemData.column2}</div>
      <div className='item-col item-col-left'>{itemData.column3}</div>
    </div>
  );

  const ItemComponent = isMobile ? ItemComponentMobile : ItemComponentDesktop;

  return (
    <div className={`list ${isMobile ? 'mobile' : ''}`}>
      {data.map((itemData) => (
        <div key={itemData.id} className='item'>
          <ItemComponent itemData={itemData} />
        </div>
      ))}
      <style jsx>{`
        .list {
          display: flex;
          flex-direction: column;
        }

        .item-desktop {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #ddd;
        }

        .item-mobile {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid #ddd;
        }

        .item-col {
          flex: 1;
          padding: 8px;
          text-align: center;
        }

        .item-col-left {
          text-align: left;
        }

        .item-col-right {
          text-align: right;
        }

        @media (max-width: 1024px) {
          .list.mobile .item {
            margin-bottom: 16px;
          }
          .list.mobile .item:last-child {
            margin-bottom: 0;
          }
          .list.mobile .item .item-col {
            width: 100%;
          }
          .item-desktop {
            display: none;
          }
          .item-mobile {
            display: flex;
            flex-direction: row;
          }
          .item-mobile .item-col:nth-child(1),
          .item-mobile .item-col:nth-child(3) {
            flex: 1;
            text-align: left;
          }
          .item-mobile .item-col:nth-child(2) {
            flex: 2;
            text-align: right;
          }
        }
      `}</style>
    </div>
  );
};

export default List;
