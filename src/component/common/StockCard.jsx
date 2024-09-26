import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';
import StockChart from './StockChart';
import useFavorite from '../../hook/useFavoritePost';

const openNewPage = (path) => {
  console.log(`open new ${path}`);

  const url = `https://www.ptt.cc${path}`;
  window.open(url, '_blank');
};

export default function StockCard(props) {
  const { post, mini } = props;
  const { isRecentPost, processedData, historicalInfo } = post;
  const [isFavorite, handleFavoriteClick] = useFavorite(post);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    navigate(`/my/author/${post.author}`);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
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
            <IconButton size='small' aria-label='bookmark' onClick={handleFavoriteClick} sx={{ color: isFavorite ? 'primary.main' : 'inherit' }}>
              {isFavorite ? <BookmarkIcon fontSize='small' /> : <BookmarkBorderIcon fontSize='small' />}
            </IconButton>
            {processedData && processedData.length > 0 && !mini && (
              <IconButton onClick={toggleExpand} size='small'>
                {expanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
              </IconButton>
            )}
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
        {processedData && processedData.length > 0 && (
          <StockCardBody processedData={processedData} historicalInfo={historicalInfo} mini={mini} expanded={expanded} />
        )}
      </CardContent>
    </Card>
  );
}

const StockCardBody = ({ historicalInfo, processedData, mini, expanded }) => {
  const baseDate = processedData.find((item) => item.type === 'base');
  const highestDate = processedData.find((item) => item.type === 'highest');
  const latestDate = processedData.find((item) => item.type === 'latest');

  return mini ? (
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
    <Box>
      <PriceInfoBody baseDate={baseDate} highestDate={highestDate} latestDate={latestDate} />
      <Collapse in={expanded}>
        <Box mt={1}></Box>
        <StockChart rawData={historicalInfo} />
      </Collapse>
    </Box>
  );
};

export const PriceInfoBody = ({ baseDate, highestDate, latestDate }) => {
  const priceData = [
    { label: '基準', ...baseDate },
    { label: '最高', ...highestDate },
    { label: '最近', ...latestDate },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 0, mt: 1 }}>
      {priceData.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant='caption' sx={{ width: '15%', textAlign: 'left' }}>
            {item.label}
          </Typography>
          <Typography variant='body2' sx={{ width: '30%' }}>
            {item.date ? toYYYYMMDDWithSeparator(item.date, '-') : '-'}
          </Typography>
          <Typography variant='body1' sx={{ width: '25%', fontWeight: 'bold' }}>
            {item.price ? item.price.toFixed(2) : '-'}
          </Typography>
          {item.diff && item.diff !== 0 ? (
            <Typography
              variant='body2'
              sx={{
                width: '30%',
                color: item.diff >= 0 ? 'error.main' : 'success.main',
                textAlign: 'right',
              }}
            >
              {item.diff.toFixed(1)} ({item.diffPercent.toFixed(2)}%)
            </Typography>
          ) : (
            <Box sx={{ width: '30%', textAlign: 'right' }}> - </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};
