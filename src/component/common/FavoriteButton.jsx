import React, { useState } from 'react';
import api from '../../utility/api';

export const FavoriteButton = (props) => {
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
