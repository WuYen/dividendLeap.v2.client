import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, TextField, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SettingPage() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddKeyword = async () => {
    if (inputValue.trim() !== '') {
      try {
        setIsLoading(true);
        //TODO: callAPI, then setIsLoading(false)
        setKeywords([...keywords, inputValue]);
        setInputValue('');
      } catch (error) {
        console.error('Failed to save keyword', error);
      }
    }
  };

  const handleDeleteKeyword = async (keywordToDelete) => {
    try {
      //TODO: callAPI
      setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
    } catch (error) {
      console.error('Failed to delete keyword', error);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 0,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        size='small'
      >
        <ArrowBackIcon fontSize='small' />
      </IconButton>

      <Box sx={{ p: 3 }}>
        <h2>Settings</h2>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            // inputRef={inputRef}
            fullWidth
            variant='outlined'
            label='新增關鍵字'
            name='keyword'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />
          <Button variant='contained' onClick={handleAddKeyword}>
            新增
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {keywords.map((keyword, index) => (
            <Chip key={index} label={keyword} onDelete={() => handleDeleteKeyword(keyword)} sx={{ mb: 1 }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
