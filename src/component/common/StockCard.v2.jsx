import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip, IconButton, TextField } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';
import useFavorite from '../../hook/useFavoritePost';
import api from '../../utility/api';
import { useSetRecoilState } from 'recoil';
import { favoritesState } from '../../state/atoms';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const openNewPage = (path) => {
  const url = `https://www.ptt.cc/${path}`;
  window.open(url, '_blank');
};

export default function StockCard(props) {
  const { post, mini } = props;
  const { isRecentPost, processedData } = post;
  const [isFavorite, handleFavoriteClick] = useFavorite(post);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const setFavorites = useSetRecoilState(favoritesState);

  const [isEditing, setIsEditing] = useState(false);
  const [editedCost, setEditedCost] = useState(post.cost !== null && post.cost !== undefined ? post.cost : '');
  const [editedShares, setEditedShares] = useState(post.shares !== null && post.shares !== undefined ? post.shares : '');

  const handleEditClick = () => {
    setEditedCost(post.cost !== null && post.cost !== undefined ? post.cost : '');
    setEditedShares(post.shares !== null && post.shares !== undefined ? post.shares : '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    console.log('start handleSaveEdit', editedCost, editedShares);
    try {
      const response = await api.post(`/my/post/${post.id}/update`, {
        cost: editedCost,
        shares: editedShares,
      });
      console.log('handleSaveEdit', response.data);

      if (response.success) {
        setFavorites((prevState) => {
          const newState = {
            ...prevState,
            posts: prevState.posts.map((p) => {
              if (p.id === post.id) {
                console.log('state:', response.data, p);
              }
              return p.id === post.id ? { ...response.data } : p;
            }),
          };

          return newState;
        });

        setIsEditing(false);
        alert('更新成功');
      } else {
        alert('更新失敗');
      }
    } catch (error) {
      console.error('handleSaveEdit error', error);
      alert('更新失敗');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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
            <Box
              onClick={() => openNewPage(post.href)}
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                flexGrow: 1,
                textAlign: 'left',
                marginRight: '20px',
                padding: '4px', // Adjust the padding as needed to control the clickable area
                display: 'inline-block',
              }}
            >
              <Typography
                variant='subtitle1'
                component='div'
                sx={{
                  display: 'inline-block',
                  padding: 0,
                  margin: 0,
                }}
              >
                [{post.tag}] {post.title}
              </Typography>
            </Box>
            <StockCardToolbar
              isEditing={isEditing}
              onEditClick={handleEditClick}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              isFavorite={isFavorite}
              onFavoriteClick={handleFavoriteClick}
              hasProcessedData={processedData && processedData.length > 0}
              mini={mini}
              expanded={expanded}
              onExpandClick={toggleExpand}
            />
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
            {/* <Typography variant='subtitle2' color='text.secondary'>
              進場:123 停利:456 停損:789
            </Typography> */}
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
                    lineHeight: 1,
                  }}
                />
              )}
              <Typography variant='subtitle2' color='text.secondary'>
                {toYYYYMMDDWithSeparator(new Date(post.id * 1000), '-')}
              </Typography>
            </Box>
          </Box>
        </Box>
        {processedData && processedData.length > 0 && (
          <>
            {isEditing ? (
              <EditablePriceInfoRow
                post={post}
                editedCost={editedCost}
                setEditedCost={setEditedCost}
                editedShares={editedShares}
                setEditedShares={setEditedShares}
              />
            ) : (
              <NewPriceInfoRow post={post} />
            )}
            {expanded && (
              <Box display='flex' bgcolor='grey.100' pt={1} pb={0.5} px={0.5} borderRadius={1} mt={1}>
                <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
                  <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
                    <Typography variant='caption' color='text.secondary' lineHeight={1}>
                      進場
                    </Typography>
                    <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
                      進場值
                    </Typography>
                  </Box>
                  <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
                    <Typography variant='caption' color='text.secondary' lineHeight={1}>
                      停利
                    </Typography>
                    <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
                      停利值
                    </Typography>
                  </Box>
                  <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
                    <Typography variant='caption' color='text.secondary' lineHeight={1}>
                      停損
                    </Typography>
                    <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
                      停損值
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

const StockCardToolbar = ({
  isEditing,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  isFavorite,
  onFavoriteClick,
  // hasProcessedData,
  // mini,
  // expanded,
  // onExpandClick,
}) => {
  if (isEditing) {
    return (
      <>
        <IconButton size='small' onClick={onSaveEdit} sx={{ mr: 1 }}>
          <CheckIcon fontSize='small' />
        </IconButton>
        <IconButton size='small' onClick={onCancelEdit}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </>
    );
  }

  return (
    <>
      <IconButton size='small' onClick={onEditClick}>
        <EditIcon fontSize='small' />
      </IconButton>
      <IconButton size='small' aria-label='bookmark' onClick={onFavoriteClick} sx={{ color: isFavorite ? 'primary.main' : 'inherit' }}>
        {isFavorite ? <BookmarkIcon fontSize='small' /> : <BookmarkBorderIcon fontSize='small' />}
      </IconButton>
      {/* <IconButton onClick={onExpandClick} size='small'>
        {expanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
      </IconButton> */}
    </>
  );
};

const formatNumber = (num) => (num !== '-' ? num.toLocaleString() : '-');

const NewPriceInfoRow = (props) => {
  const { post } = props;
  const latestDate = post.processedData.find((item) => item.type === 'latest');

  const currentPrice = latestDate ? formatNumber(latestDate.price) : '-';
  const cost = post.cost !== null && post.cost !== undefined ? formatNumber(post.cost) : '-';
  const shares = post.shares !== null && post.shares !== undefined ? formatNumber(post.shares) : '-';
  const profit = post.profit !== null && post.profit !== undefined ? formatNumber(post.profit) : '-';
  const profitRate = post.profitRate !== null && post.profitRate !== undefined ? `${post.profitRate}%` : '-';

  return (
    <Box display='flex' bgcolor='grey.100' pt={1} pb={0.5} px={0.5} borderRadius={1} mt={1}>
      <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            現價
          </Typography>
          <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
            {currentPrice}
          </Typography>
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            成交均價
          </Typography>
          <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
            {cost}
          </Typography>
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            股數
          </Typography>
          <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
            {shares}
          </Typography>
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            獲利
          </Typography>
          <Typography variant='body2' fontWeight='bold' color={profit === '-' ? 'text.primary' : post.profit < 0 ? 'success.main' : 'error.main'}>
            {profit}
          </Typography>
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            獲利率
          </Typography>
          <Typography
            variant='body2'
            fontWeight='bold'
            color={profitRate === '-' ? 'text.primary' : post.profitRate < 0 ? 'success.main' : 'error.main'}
          >
            {profitRate}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EditablePriceInfoRow = (props) => {
  const { post, editedCost, setEditedCost, editedShares, setEditedShares } = props;
  const latestDate = post.processedData.find((item) => item.type === 'latest');
  const currentPrice = latestDate ? formatNumber(latestDate.price) : '-';

  return (
    <Box display='flex' bgcolor='grey.100' pt={1} pb={0.5} px={0.5} borderRadius={1} mt={1}>
      <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            現價
          </Typography>
          <Typography variant='body2' fontWeight='bold' lineHeight='1.5rem'>
            {currentPrice}
          </Typography>
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            成交均價
          </Typography>
          <StyledValuleInput value={editedCost} onChange={(e) => setEditedCost(e.target.value)} inputProps={{ style: { textAlign: 'center' } }} />
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center' mr={1}>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            股數
          </Typography>
          <StyledValuleInput value={editedShares} onChange={(e) => setEditedShares(e.target.value)} inputProps={{ style: { textAlign: 'center' } }} />
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            獲利
          </Typography>
          <Typography variant='body2' fontWeight='bold' color={'text.primary'}>
            -
          </Typography>
        </Box>
        <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='caption' color='text.secondary' lineHeight={1}>
            獲利率
          </Typography>
          <Typography variant='body2' fontWeight='bold' color={'text.primary'}>
            -
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const StyledValuleInput = ({ value, onChange, ...props }) => (
  <TextField
    value={value}
    onChange={onChange}
    variant='standard'
    size='small'
    type='number'
    sx={{
      width: '90%',
      '& .MuiInput-root': {
        marginTop: 0,
        height: '1.5rem', // Ensure the height matches the Typography
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
        boxSizing: 'border-box', // Include border in the element's height
      },
      '& .MuiInput-input': {
        padding: 0,
        height: '1.5rem', // Ensure the height matches the Typography
        fontSize: '0.875rem',
        fontWeight: 'bold',
        lineHeight: '1.5rem', // Ensure the line height matches the Typography
        boxSizing: 'border-box', // Include border in the element's height
        textAlign: 'center', // Center text horizontally
      },
      '& .MuiInput-underline:before': {
        borderBottomWidth: '1px',
      },
      '& .MuiInput-underline:after': {
        borderBottomWidth: '1px',
      },
    }}
    {...props}
  />
);
