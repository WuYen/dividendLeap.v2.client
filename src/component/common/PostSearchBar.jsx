import React, { useState, useEffect } from 'react';
import { Box, Paper, InputBase, IconButton, Select, MenuItem, FormControl, InputLabel, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { debounce } from 'lodash';

const SearchBar = ({ onSearchTextChange, tags, activeTag, onTagChange }) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const debouncedChange = debounce(onSearchTextChange, 300);
    debouncedChange(searchText);
    return () => {
      debouncedChange.cancel();
    };
  }, [searchText, onSearchTextChange]);

  return (
    <Box
      sx={{
        maxWidth: '600px',
        margin: '0 auto 20px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Paper
        component='form'
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
          flex: 1,
          backgroundColor: '#f5f5f5', // Background color similar to your example
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder='Search'
          inputProps={{ 'aria-label': 'search' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Badge badgeContent={1} color='error'>
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#f5f5f5', // Background color similar to your example
          }}
          onClick={() => console.log('Filter clicked')} // Replace with actual filter logic
        >
          <IconButton type='button' sx={{ p: '10px' }} aria-label='filter'>
            <FilterListIcon />
          </IconButton>
          <Box sx={{ pr: 2 }}>Filter</Box>
        </Paper>
      </Badge>
    </Box>
  );
};

export function PostList(props) {
  const { data, mini = false, tagFilter = true } = props;
  const containTargetPosts = data.find((item) => item.tag === '標的');
  const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const filteredData = data.filter((item) => {
    return (activeTag === '全部' || item.tag === activeTag) && (!searchText || item.title.includes(searchText));
  });

  return (
    <>
      {tagFilter && (
        <SearchBar
          onSearchTextChange={handleSearchTextChange}
          tags={containTargetPosts ? ['標的', '全部'] : ['全部']}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      )}
      {filteredData.map((postInfo) => (
        <StockCard key={postInfo.id} post={postInfo} mini={mini} />
      ))}
    </>
  );
}

export default PostList;
