import React, { useState, useEffect } from 'react';
import { Box, Paper, InputBase, IconButton, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';

export const SearchBar = ({ onSearchTextChange, tags, activeTag, onTagChange }) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const debouncedChange = debounce(onSearchTextChange, 300);
    debouncedChange(searchText);
    return () => {
      debouncedChange.cancel();
    };
  }, [searchText, onSearchTextChange]);

  useEffect(() => {
    if (tags.length > 0 && !activeTag) {
      onTagChange(tags[0]);
    }
  }, [tags, activeTag, onTagChange]);

  const handleTagChange = (event) => {
    onTagChange(event.target.value);
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
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
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

// export function PostList(props) {
//   const { data, mini = false, tagFilter = true } = props;
//   const containTargetPosts = data.find((item) => item.tag === '標的');
//   const [activeTag, setActiveTag] = useState(containTargetPosts ? '標的' : '全部');
//   const [searchText, setSearchText] = useState('');

//   const handleSearchTextChange = (text) => {
//     setSearchText(text);
//   };

//   const filteredData = data.filter((item) => {
//     return (activeTag === '全部' || item.tag === activeTag) && (!searchText || item.title.includes(searchText));
//   });

//   return (
//     <>
//       {tagFilter && (
//         <SearchBar
//           onSearchTextChange={handleSearchTextChange}
//           tags={containTargetPosts ? ['標的', '全部'] : ['全部']}
//           activeTag={activeTag}
//           onTagChange={setActiveTag}
//         />
//       )}
//       {filteredData.map((postInfo) => (
//         <StockCard key={postInfo.id} post={postInfo} mini={mini} />
//       ))}
//     </>
//   );
// }

// export default PostList;
