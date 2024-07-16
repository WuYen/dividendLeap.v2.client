import React from 'react';
import { Box, Radio, FormControlLabel, Typography } from '@mui/material';

const primaryColor = '#185ee0';
const secondaryColor = '#e6eef9';

export function PostTabs(props) {
  const { activeTag, onSetActiveTag, containTargetPosts } = props;
  const tagArray = containTargetPosts ? ['標的', '全部'] : ['全部'];
  return <Tabs tagArray={tagArray} activeTag={activeTag} onTabClick={onSetActiveTag} />;
}

export function Tabs(props) {
  const { tagArray, activeTag, onTabClick } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          bgcolor: '#fff',
          boxShadow: '0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15)',
          padding: '5px',
          borderRadius: '99px',
          '@media (max-width: 700px)': {
            maxWidth: '100vw',
            overflowX: 'auto',
          },
        }}
      >
        {tagArray.map((tag) => (
          <FormControlLabel
            key={tag}
            value={tag}
            control={<Radio sx={{ display: 'none' }} checked={activeTag === tag} onChange={() => onTabClick(tag)} />}
            label={
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '25px',
                  width: '66px',
                  minWidth: '66px',
                  fontWeight: 500,
                  borderRadius: '99px',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease-in',
                  color: activeTag === tag ? primaryColor : 'inherit',
                  zIndex: 2,
                }}
              >
                {tag}
              </Typography>
            }
            sx={{ margin: 0 }}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            height: '25px',
            width: '66px',
            minWidth: '66px',
            bgcolor: secondaryColor,
            zIndex: 1,
            borderRadius: '99px',
            transition: '0.25s ease-out',
            transform: `translateX(${tagArray.indexOf(activeTag) * 100}%)`,
          }}
        />
      </Box>
    </Box>
  );
}

export default Tabs;
