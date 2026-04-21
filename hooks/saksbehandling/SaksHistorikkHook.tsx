'use client';

import useSWR from 'swr';
import { clientHentSakshistorikk } from 'lib/clientApi';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

export function useSaksHistorikk() {
  const params = useParamsMedType();

  if (!params.saksnummer) {
    throw new Error('fant ikke saksnummer');
  }

  const { data: historikk, mutate } = useSWR(
    `sak/${params.saksnummer}/historikk`,
    () => clientHentSakshistorikk(params.saksnummer),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  return {
    historikk,
    refetchSaksHistorikkClient: mutate,
  };
}
