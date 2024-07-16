import PageTitle from '../common/PageTitle';
import { Box, Typography } from '@mui/material';

function ServerError() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <PageTitle titleText={'🐒 Oops!'}></PageTitle>
      <Typography variant='body2' sx={{ mb: 2 }}>
        Looks like something went wrong.
      </Typography>
    </Box>
  );
}

export default ServerError;
