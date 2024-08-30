import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, TextField, Button, Chip, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import api from '../../utility/api';

export default function SettingPage() {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(`/my`, { replace: true });
    }
  };

  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // To handle initial loading

  useEffect(() => {
    // Fetch keywords when the component mounts
    const fetchKeywords = async () => {
      try {
        setIsFetching(true);
        const response = await api.get('/my/keywords'); // Fetching keywords from the endpoint
        setKeywords(response.data); // Assuming response.data.data contains the keywords
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchKeywords();
  }, []);

  const handleKeywordAction = async (action, keyword) => {
    setIsLoading(true);
    try {
      if (action === 'add' && keyword.trim() !== '') {
        const response = await api.post('/my/keywords/add', { keywords: [keyword] });
        console.log('keyword add', response);
        setKeywords([...keywords, keyword]);
        setInputValue('');
      } else if (action === 'delete') {
        const response = await api.post('/my/keywords/remove', { keywords: [keyword] });
        console.log('keyword remove', response);
        setKeywords(keywords.filter((item) => item !== keyword));
      }
    } catch (error) {
      console.error(`Failed to ${action} keyword`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleKeywordAction('add', inputValue);
  };

  return isFetching ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Box
        sx={{
          maxWidth: '450px',
          minWidth: '450px',
          margin: '0 auto 15px',
          position: 'relative',
          display: 'flex',
          height: '28px',
        }}
      >
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
      </Box>
      <Paper
        sx={{
          p: 3,
          width: { xs: '90%', sm: '400px' },
        }}
      >
        <Typography variant='body2' sx={{ mb: 2 }}>
          ✏️ 請輸入並管理你的關鍵字
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant='outlined'
            label='新增關鍵字'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
            autoComplete='off'
          />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button variant='contained' fullWidth type='submit'>
              新增關鍵字
            </Button>
          )}
        </form>

        <Box sx={{ mt: 2 }}>
          {keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <Chip key={index} label={keyword} onDelete={() => handleKeywordAction('delete', keyword)} sx={{ mb: 1, mr: 1 }} />
            ))
          ) : (
            <Typography variant='body2' color='textSecondary'>
              暫無關鍵字
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
