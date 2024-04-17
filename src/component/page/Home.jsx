// import { useEffect, useState } from 'react';
// import './Home.css';

import PageTitle from '../common/PageTitle';
import TeaLoading from '../loading/TeaLoading';

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
