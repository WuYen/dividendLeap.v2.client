// import { useEffect, useState } from 'react';

import PageTitle from '../common/PageTitle';

function ServerError() {
  return (
    <div className='App'>
      <PageTitle titleText={'🐒 Oops!'}></PageTitle>
      <p>Looks like something went wrong.</p>
    </div>
  );
}

export default ServerError;
