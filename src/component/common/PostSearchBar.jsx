import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, InputBase, IconButton, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { debounce } from 'lodash';

export const PostSearchBar = ({ onSearchTextChange, onSearchClick, tags, activeTag, onTagChange }) => {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchChangeRef = useRef();

  const handleTagChange = (event) => {
    onTagChange(event.target.value);
  };

  useEffect(() => {
    debouncedSearchChangeRef.current = debounce((text) => {
      onSearchTextChange(text);
    }, 300);

    return () => {
      if (debouncedSearchChangeRef.current) {
        debouncedSearchChangeRef.current.cancel();
      }
    };
  }, [onSearchTextChange]);

  const handleSearchTextChange = (e) => {
    const newText = e.target.value;
    setSearchText(newText); // 立即更新本地狀態
    debouncedSearchChangeRef.current(newText); // debounce 父組件的更新
  };

  return (
    <Box
      sx={{
        maxWidth: '450px',
        margin: '0 auto 10px',
        position: 'relative',
        display: 'flex',
        gap: '8px',
      }}
    >
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder='Search'
          inputProps={{ 'aria-label': 'search' }}
          value={searchText}
          onChange={handleSearchTextChange}
        />
        {searchText && (
          <IconButton
            sx={{ p: '10px' }}
            aria-label='clear'
            onClick={() => {
              setSearchText('');
              onSearchTextChange('');
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
        <IconButton type='button' sx={{ p: '10px' }} aria-label='search' onClick={() => onSearchClick(searchText)}>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Paper sx={{ width: '85px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <Select
          value={activeTag || ''}
          onChange={handleTagChange}
          displayEmpty
          sx={{
            width: '100%',
            '& .MuiSelect-select': {
              p: '8px 14px',
              border: 'none',
              textAlign: 'center',
              paddingRight: '32px',
              display: 'flex',
              alignItems: 'center', // 垂直居中
              justifyContent: 'center', // 水平居中
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 200 },
            },
          }}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag} sx={{ justifyContent: 'center', textAlign: 'center' }}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </Paper>
    </Box>
  );
};
