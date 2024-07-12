// import { useEffect, useState } from 'react';

import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';
import { Box } from '@mui/material';

function Home() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <div>
        <PageTitle titleText={`COMING SOON`} />
        <div>ထ days left</div>
        <TeaLoading />
      </div>
    </Box>
  );
}

export default Home;
