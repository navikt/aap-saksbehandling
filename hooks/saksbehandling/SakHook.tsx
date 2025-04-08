'use client';

import useSWR from 'swr';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { clientHentSak } from 'lib/clientApi';
export const useSakHook = () => {
  const saksId = useSaksnummer();
  const { data, isValidating } = useSWR(`sak/${saksId}`, () => clientHentSak(saksId));

  if (!data && !isValidating) {
    throw Error('Feil ved henting av sak');
  }

  return { sak: data };
};
