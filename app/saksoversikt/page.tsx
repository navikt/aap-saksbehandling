'use client';

import { finnSak, hentBehandling, hentSak, opprettSak } from '../../lib/api';
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    async function doThis() {
      const finnSakResponse = await finnSak('12345678910');

      console.log('finn', finnSakResponse);

      if (finnSakResponse && finnSakResponse[0].saksnummer) {
        const sak = await hentSak(finnSakResponse[0].saksnummer);

        console.log('sak', sak);

        if (sak?.behandlinger) {
          sak.behandlinger.map(async (sak, index) => {
            if (sak.referanse) {
              const behandlinger = await hentBehandling(sak.referanse);
              console.log(`behandling nr. ${index}`, behandlinger);
            }
          });
        }
      }
    }
    doThis();
  });

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
