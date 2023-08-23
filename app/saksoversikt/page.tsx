'use client';

import { opprettSak } from '../../lib/api';

const Page = () => {
  return (
    <>
      <h1>Saksoversikt page</h1>
      <button onClick={opprettSak}>Opprett test sak</button>
    </>
  );
};

export default Page;
