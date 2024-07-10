import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, List, ListItem, IconButton, Collapse, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
//import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { toYYYYMMDDWithSeparator } from '../../utility/formatter';

const AuthorCard = (props) => {
  const { author, maxRate, median, score, posts } = props;
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAuthorClick = () => {
    navigate(`/my/author/${author}`);
  };

  // const handleLikeClick = (e) => {
  //   e.stopPropagation();
  //   onLike(author);
  // };

  return (
    <Card sx={{ maxWidth: 450, margin: '10px auto' }}>
      <CardContent sx={{ padding: '12px', '&:last-child': { paddingBottom: '12px' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant='subtitle1'
            component='div'
            onClick={handleAuthorClick}
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
              flexGrow: 1,
              textAlign: 'left',
            }}
          >
            {author}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* {likeCount !== undefined && (
              <>
                <Typography variant='body2' sx={{ mr: 1 }}>
                  {likeCount}
                </Typography>
                <IconButton onClick={handleLikeClick} size='small'>
                  <ThumbUpIcon fontSize='small' />
                </IconButton>
              </>
            )} */}
            {posts && posts.length > 0 && (
              <IconButton onClick={toggleExpand} size='small'>
                {expanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
              </IconButton>
            )}
          </Box>
        </Box>

        <Box display='flex' bgcolor='grey.100' p={1} borderRadius={1} mt={1}>
          <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
            <StatItem label='Median' value={median !== undefined && median !== 0 ? median.toFixed(2) : '-'} />
            <Typography variant='body1' color='text.secondary' sx={{ mx: 1 }}>
              |
            </Typography>
            <StatItem label='Max Rate' value={maxRate !== undefined && maxRate !== 0 ? maxRate.toFixed(2) : '-'} />
            <Typography variant='body1' color='text.secondary' sx={{ mx: 1 }}>
              |
            </Typography>
            <StatItem label='score' value={score !== undefined && score !== 0 ? score.toFixed(2) : '-'} />
          </Box>
        </Box>
      </CardContent>
      {posts && posts.length > 0 && (
        <Collapse in={expanded}>
          <List dense sx={{ padding: '0px 0px 12px 0px' }}>
            {posts.map((post, index) => (
              <ListItem key={index}>
                <Box display='flex' alignItems='center' width='100%'>
                  <Typography
                    variant='body2'
                    color='text.primary'
                    sx={{
                      flexGrow: 1,
                      mr: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Box width='70px' flexShrink={0} display='flex' justifyContent='flex-start'>
                    <Typography variant='caption' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
                      {toYYYYMMDDWithSeparator(post.date, '-')}
                    </Typography>
                  </Box>
                  <Typography
                    variant='caption'
                    color={post.highest.diffPercent >= 0 ? 'error.main' : 'success.main'}
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0, width: '65px', textAlign: 'right' }}
                  >
                    {post.highest.diffPercent.toFixed(2)}%
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Card>
  );
};

const StatItem = ({ label, value }) => (
  <Box flex={1} display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='subtitle1' fontWeight='bold' color='primary'>
      {value}
    </Typography>
  </Box>
);

export default AuthorCard;
