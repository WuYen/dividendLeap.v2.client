// import { useEffect, useState } from 'react';
// import './Home.css';

import TeaLoading from '../loading/TeaLoading';

function Home() {
  return (
    <div className="App">
      <div>
        <h1 style={{ marginTop: '40px', marginBottom: '40px' }}>COMING SOON</h1>
        <hr style={{ margin: 'auto', width: '40%' }} />
        <p>ထ days left</p>
        <TeaLoading />
      </div>
    </div>
  );
}

export default Home;
