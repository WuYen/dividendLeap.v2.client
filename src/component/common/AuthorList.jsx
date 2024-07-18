import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utility/debounce';
import AuthorCard from './AuthorCard';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// 數據轉換函數
//TODO: server should normalize this data
const normalizeAuthorData = (item) => {
  if (item.name) {
    // 第一種數據格式
    return {
      author: item.name,
      likeCount: item.likes,
      ...item,
    };
  } else if (item.author) {
    // 第二種數據格式
    return {
      maxRate: item.maxRate,
      median: item.median,
      score: item.score,
      posts: item.posts,
      likeCount: 0,
      ...item,
    };
  }
  return item;
};

export function AuthorList(props) {
  const { data } = props;
  const normalizedData = useMemo(() => data.map(normalizeAuthorData), [data]);
  const [filteredData, setFilteredData] = useState(normalizedData);

  const handleFilterData = useCallback(
    (searchText) => {
      const filtered = normalizedData.filter((item) => item.author.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredData(filtered);
    },
    [normalizedData]
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
