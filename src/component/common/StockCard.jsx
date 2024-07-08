import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { favoritesState } from '../../state/atoms';
import { Card, CardContent, Typography, Box, Divider, Chip, IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';
import api from '../../utility/api';

const openNewPage = (path) => {
  const url = `https://www.ptt.cc/${path}`;
  window.open(url, '_blank');
};

const StockCard = ({ data }) => {
  const { isRecentPost, processedData } = data;
  const [isFavorite, handleFavoriteClick] = useFavorite(data);
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    navigate(`/my/author/${data.author}`);
  };

  return (
    <Card sx={{ maxWidth: 450, margin: '10px auto' }}>
      <CardContent
        sx={{
          padding: '12px',
          '&:last-child': {
            paddingBottom: '12px',
          },
        }}
      >
        <Box textAlign='left' mb={1}>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={0}>
            <Box display='flex' alignItems='center'>
              <Typography
                variant='subtitle2'
                color='text.secondary'
                sx={{
                  mr: 1,
                  lineHeight: 1, // 减小行高
                  display: 'flex',
                  alignItems: 'center',
                  height: '20px', // 与Chip高度一致
                  fontSize: '0.9rem',
                }}
              >
                {toYYYYMMDDWithSeparator(new Date(data.id * 1000), '-')}
              </Typography>
              {isRecentPost && (
                <Chip
                  label='新'
                  size='small'
                  sx={{
                    backgroundColor: 'lightblue',
                    color: 'white',
                    height: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 'normal', // 确保字体粗细一致
                    lineHeight: '20px', // 确保文字垂直居中
                  }}
                />
              )}
            </Box>
            <Box>
              <IconButton
                size='small'
                aria-label='bookmark'
                onClick={handleFavoriteClick}
                sx={{ color: isFavorite ? 'primary.main' : 'inherit' }}
              >
                {isFavorite ? <BookmarkIcon fontSize='small' /> : <BookmarkBorderIcon fontSize='small' />}
              </IconButton>
              {/* 這裡可以添加更多功能按鈕 */}
            </Box>
          </Box>
          <Typography
            variant='h6'
            component='div'
            onClick={() => openNewPage(data.href)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            [{data.tag}] {data.stockNo} {data.title}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            component='div'
            onClick={handleAuthorClick}
            color='text.secondary'
            gutterBottom
          >
            {data.author}
          </Typography>
        </Box>
        {processedData && processedData.length > 0 && (
          <>
            <Divider />
            <StockCardBody processedData={processedData} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

const StockCardBody = ({ processedData }) => {
  const baseDate = processedData.find((item) => item.type === 'base');
  const highestDate = processedData.find((item) => item.type === 'highest');
  const latestDate = processedData.find((item) => item.type === 'latest');

  return (
    <Box display='flex' justifyContent='space-between' mt={1} mb={0}>
      <PriceColumn
        label='四個月內最高'
        date={highestDate.date}
        price={highestDate.price}
        diff={highestDate.diff}
        diffPercent={highestDate.diffPercent}
      />
      <PriceColumn label='基準日' date={baseDate.date} price={baseDate.price} diff={null} diffPercent={null} />
      <PriceColumn
        label='最近交易日'
        date={latestDate.date}
        price={latestDate.price}
        diff={latestDate.diff}
        diffPercent={latestDate.diffPercent}
      />
    </Box>
  );
};

const PriceColumn = ({ label, date, price, diff, diffPercent }) => (
  <Box display='flex' flexDirection='column' alignItems='center'>
    <Typography variant='body2' fontWeight='bold'>
      {label}
    </Typography>
    <Typography variant='body2' color='text.secondary' fontSize='0.75rem'>
      {toYYYYMMDDWithSeparator(date, '-')}
    </Typography>
    <Typography variant='h6' fontWeight='bold'>
      {price.toFixed(2)}
    </Typography>
    {diff !== null && (
      <Typography variant='body2' color={diff >= 0 ? 'error.main' : 'success.main'}>
        {diff.toFixed(1)}
        <br />({diffPercent.toFixed(2)}%)
      </Typography>
    )}
    {diff === null && <Typography variant='body2'>-</Typography>}
  </Box>
);

export default StockCard;

export function MiniStockCard({ post }) {
  const latest = post.processedData?.find((x) => x.type === 'latest') || null;
  const baseDateInfo = post.historicalInfo?.[0] || null;
  const [isFavorite, handleFavoriteClick] = useFavorite(post);

  return (
    <Card sx={{ maxWidth: 450, margin: '0 auto 10px', position: 'relative' }}>
      <CardContent sx={{ padding: '8px 16px', '&:last-child': { paddingBottom: '8px' } }}>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={0}>
          <Typography
            variant='subtitle1'
            component='div'
            onClick={() => openNewPage(post.href)}
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
              flexGrow: 1,
              textAlign: 'left',
            }}
          >
            [{post.tag}] {post.title}
          </Typography>
          <IconButton
            size='small'
            aria-label='bookmark'
            onClick={handleFavoriteClick}
            sx={{ color: isFavorite ? 'primary.main' : 'inherit' }}
          >
            {isFavorite ? <BookmarkIcon fontSize='small' /> : <BookmarkBorderIcon fontSize='small' />}
          </IconButton>
        </Box>
        <Box display='flex' alignItems='center' ml={0}>
          <Typography variant='body2' color='text.secondary'>
            {baseDateInfo?.close ? baseDateInfo.close.toFixed(2) : '-'}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mx: 1 }}>
            |
          </Typography>
          <Typography variant='body2' fontWeight='bold'>
            {latest?.price ? latest.price.toFixed(2) : '-'}
          </Typography>
          {latest && latest.diff !== undefined && latest.diffPercent !== undefined && (
            <Typography variant='body2' color={latest.diff >= 0 ? 'success.main' : 'error.main'} sx={{ ml: 1 }}>
              {latest.diff} ({latest.diffPercent}%)
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function useFavorite(post) {
  const [favorites, setFavorites] = useRecoilState(favoritesState);

  const isFavorite = favorites.posts.some((p) => p.id === post.id);

  const toggleFavorite = useCallback(async () => {
    const newFavoriteStatus = !isFavorite;

    try {
      const response = await api.get(`/my/post/${post.id}/favorite`);
      if (response.success) {
        setFavorites((prev) => {
          if (newFavoriteStatus) {
            return {
              ...prev,
              posts: [...prev.posts, post],
            };
          } else {
            return {
              ...prev,
              posts: prev.posts.filter((p) => p.id !== post.id),
            };
          }
        });
      } else {
        alert('收藏失敗');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('收藏失敗');
    }
  }, [isFavorite, post, setFavorites]);

  return [isFavorite, toggleFavorite];
}
