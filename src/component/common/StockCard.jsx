import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { favoritesState } from '../../state/atoms';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';
import api from '../../utility/api';

const openNewPage = (path) => {
  const url = `https://www.ptt.cc/${path}`;
  window.open(url, '_blank');
};

const StockCard = (props) => {
  const { post, mini } = props;
  const { isRecentPost, processedData } = post;
  const [isFavorite, handleFavoriteClick] = useFavorite(post);
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    navigate(`/my/author/${post.author}`);
  };

  return (
    <Card sx={{ maxWidth: 450, margin: '10px auto' }}>
      <CardContent sx={{ padding: '12px', '&:last-child': { paddingBottom: '12px' } }}>
        <Box textAlign='left' mb={0}>
          <Box display='flex' justifyContent='space-between' alignItems='start' mb={0}>
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
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography
              variant='subtitle2'
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              component='div'
              onClick={handleAuthorClick}
              color='text.secondary'
            >
              {post.author}
            </Typography>
            <Box display='flex' alignItems='center'>
              {isRecentPost && (
                <Chip
                  label='NEW'
                  size='small'
                  sx={{
                    mr: 1,
                    backgroundColor: 'lightblue',
                    color: 'white',
                    height: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 'normal',
                    lineHeight: '20px',
                  }}
                />
              )}
              <Typography
                variant='subtitle2'
                color='text.secondary'
                sx={{
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  height: '20px',
                  fontSize: '0.9rem',
                }}
              >
                {toYYYYMMDDWithSeparator(new Date(post.id * 1000), '-')}
              </Typography>
            </Box>
          </Box>
        </Box>
        {processedData && processedData.length > 0 && <StockCardBody processedData={processedData} mini={mini} />}
      </CardContent>
    </Card>
  );
};

const StockCardBody = ({ processedData, mini }) => {
  const baseDate = processedData.find((item) => item.type === 'base');
  const highestDate = processedData.find((item) => item.type === 'highest');
  const latestDate = processedData.find((item) => item.type === 'latest');

  return true ? (
    <Box display='flex' bgcolor='grey.100' p={1} borderRadius={1} mt={1}>
      <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
        <Box flex={1} display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='body1' color='text.secondary'>
            {baseDate?.price ? baseDate.price.toFixed(2) : '-'}
          </Typography>
        </Box>
        <Typography variant='body1' color='text.secondary' sx={{ mx: 1 }}>
          |
        </Typography>
        <Box flex={1} display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='body1' fontWeight='bold'>
            {latestDate?.price ? latestDate.price.toFixed(2) : '-'}
          </Typography>
        </Box>
        <Typography variant='body1' color='text.secondary' sx={{ mx: 1 }}>
          |
        </Typography>
        <Box flex={1} display='flex' justifyContent='center' alignItems='center'>
          {latestDate && latestDate.diff !== undefined && latestDate.diffPercent !== undefined ? (
            <Typography variant='body1' color={latestDate.diff >= 0 ? 'error.main' : 'success.main'}>
              {latestDate.diffPercent.toFixed(2)}%
            </Typography>
          ) : (
            <Typography variant='body1' color='text.secondary'>
              -
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  ) : (
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
