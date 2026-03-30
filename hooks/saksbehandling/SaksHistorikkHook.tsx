'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { clientHentSakshistorikk } from 'lib/clientApi';

export function useSaksHistorikk() {
  const params = useParams<{ saksnummer: string }>();

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
