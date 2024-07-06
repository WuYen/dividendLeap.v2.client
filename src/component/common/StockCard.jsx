import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';

const StockCard = ({ data }) => {
  const { isRecentPost } = data;
  const baseDate = data.processedData.find((item) => item.type === 'base');
  const highestDate = data.processedData.find((item) => item.type === 'highest');
  const latestDate = data.processedData.find((item) => item.type === 'latest');
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
          <Typography variant='subtitle2' color='text.secondary'>
            {toYYYYMMDDWithSeparator(new Date(data.id * 1000), '-')}
            {isRecentPost ? '新' : ''}
          </Typography>
          <Typography variant='h6' component='div'>
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
        <Divider />
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
      </CardContent>
    </Card>
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
