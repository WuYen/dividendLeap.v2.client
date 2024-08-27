import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SettingPage() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box sx={{ textAlign: 'center' }}>
      this is setting
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
  );
}
