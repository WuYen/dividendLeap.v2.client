import React from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from './authAtom';
import { Box, Typography, IconButton, Drawer, List, ListItem, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function PageTitle(props) {
  const { titleText } = props;
  const auth = useRecoilValue(authState);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={2}>
        <Typography variant='h1' sx={{ mt: 1, mb: 1 }}>
          {titleText}
        </Typography>
        {auth.isLoggedIn && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            <AccountCircleIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Drawer anchor='right' open={drawerOpen} onClose={handleClose}>
        <Box sx={{ width: 250 }} role='presentation' onClick={handleClose}>
          <List>
            <ListItem>
              <Typography variant='h6'>{auth.userInfo?.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant='body2'>{auth.userInfo?.email}</Typography>
            </ListItem>
            <Divider />
            <ListItem button component='a' href='/settings'>
              Settings
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

// import { useEffect, useState } from 'react';

// export default function PageTitle(props) {
//   const { titleText } = props;

//   return (
//     <>
//       <h1 style={{ marginTop: '10px', marginBottom: '10px' }}>{titleText}</h1>
//       <hr style={{ margin: 'auto', width: '100%', maxWidth: '490px', marginBottom: '10px' }} />
//     </>
//   );
// }
// PageTitle.js
