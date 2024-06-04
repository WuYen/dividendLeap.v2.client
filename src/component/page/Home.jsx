// import { useEffect, useState } from 'react';

import PageTitle from '../common/PageTitle';
import TeaLoading from '../common/TeaLoading';

function Home() {
  return (
    <div className='App'>
      <div>
        <PageTitle titleText={`COMING SOON`} />
        <div>ထ days left</div>
        <TeaLoading />
      </div>
    </div>
  );
}

export default Home;
