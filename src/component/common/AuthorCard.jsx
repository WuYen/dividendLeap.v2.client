import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, List, ListItem, IconButton, Collapse, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const AuthorCard = (props) => {
  const { author, maxRate, median, score, posts, likeCount, onLike } = props;
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAuthorClick = () => {
    navigate(`/my/author/${author}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(author);
  };

  return (
    <Card
      sx={{
        maxWidth: '450px',
        margin: '0 auto 20px',
        position: 'relative',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant='h6'
            component='div'
            onClick={handleAuthorClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {author}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {likeCount !== undefined && (
              <>
                <Typography variant='body2' sx={{ mr: 1 }}>
                  {likeCount}
                </Typography>
                <IconButton onClick={handleLikeClick} size='small'>
                  <ThumbUpIcon />
                </IconButton>
              </>
            )}
            {posts && posts.length > 0 && (
              <IconButton onClick={toggleExpand} size='small'>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <StatItem label='Median' value={median !== undefined ? median.toFixed(2) : '-'} />
          <StatItem label='Max Rate' value={maxRate !== undefined ? maxRate.toFixed(2) : '-'} />
          <StatItem label='score' value={score !== undefined ? score.toFixed(2) : '-'} />
        </Box>
      </CardContent>
      {posts && posts.length > 0 && (
        <Collapse in={expanded}>
          <List dense>
            {posts.map((post, index) => (
              <ListItem key={index}>
                <Typography variant='body2'>
                  {post.title.substring(0, 20)}... | {post.date} | Rate: {post.highest.diffPercent}%
                </Typography>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Card>
  );
};

const StatItem = ({ label, value }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='subtitle1' fontWeight='bold' color='primary'>
      {value}
    </Typography>
  </Box>
);

export default AuthorCard;
