'use client';

import { opprettSak } from '../../lib/api';

const Page = () => {
  return (
    <>
      <h1>Saksoversikt page</h1>
      <button
        onClick={async () => await opprettSak({ yrkesskade: true, fødselsdato: '1995-02-19', ident: '12345678910' })}
      >
        Opprett test sak
      </button>
    </>
  );
};

export default Page;
