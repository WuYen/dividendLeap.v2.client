import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, List, ListItem, IconButton, Collapse, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AuthorCard = ({ author, maxRate, median, score, posts }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAuthorClick = () => {
    navigate(`/my/author/${author}`);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <StatItem label='Median' value={median.toFixed(2)} />
          <StatItem label='Max Rate' value={maxRate.toFixed(2)} />
          <StatItem label='Score' value={score.toFixed(2)} />
        </Box>
        <IconButton onClick={toggleExpand} sx={{ position: 'absolute', right: 8, top: 8 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardContent>
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
    </Card>
  );
};
const AuthorCardList = ({ data }) => {
  return (
    <div style={{ padding: '10px' }}>
      {data.map((author, index) => (
        <AuthorCard key={index} {...author} />
      ))}
    </div>
  );
};
const StatItem = ({ label, value }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='subtitle1' fontWeight='bold' color='primary'>
      {value}
    </Typography>
  </Box>
);
export default AuthorCardList;
