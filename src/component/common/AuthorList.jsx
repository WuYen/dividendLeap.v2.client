import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utility/debounce';
import AuthorCard from './AuthorCard';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function AuthorList(props) {
  const { data } = props;

  const [filteredData, setFilteredData] = useState(data);

  const handleFilterData = useCallback(
    (searchText) => {
      const filtered = data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredData(filtered);
    },
    [data]
  );

  // 使用 useMemo 來創建 debounced 版本的 handleFilterData
  const debouncedFilterData = useMemo(() => debounce(handleFilterData, 400), [handleFilterData]);
  const handleLike = useCallback((authorName) => {
    // 這裡添加處理點讚的邏輯
    console.log(`Liked author: ${authorName}`);
  }, []);

  return (
    <>
      <SearchBar onSearchTextChange={debouncedFilterData} />
      {filteredData.map((item) => (
        <AuthorCard key={item.name} {...item} onLike={handleLike} />
      ))}
    </>
  );
}

const SearchBar = ({ onSearchTextChange }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    onSearchTextChange(searchText);
  }, [searchText, onSearchTextChange]);

  const handleSearchClick = () => {
    if (searchText) {
      navigate(`/my/author/${searchText}`);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '450px',
        margin: '0 auto 10px',
        position: 'relative',
      }}
    >
      <Paper
        component='form'
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder='Search author'
          inputProps={{ 'aria-label': 'search author' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton type='button' sx={{ p: '10px' }} aria-label='search' onClick={handleSearchClick}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};
