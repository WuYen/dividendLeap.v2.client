// import { useEffect, useState } from 'react';

export default function PageTitle(props) {
  const { titleText } = props;

  return (
    <>
      <h1 style={{ marginTop: '20px', marginBottom: '20px' }}>{titleText}</h1>
      <hr style={{ margin: 'auto', width: '100%', maxWidth: '490px', marginBottom: '20px' }} />
    </>
  );
}
