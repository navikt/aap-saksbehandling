'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { clientHentSakshistorikk } from 'lib/clientApi';

export function useSaksHistorikk() {
  const params = useParams<{ saksId: string }>();

  if (!params.saksId) {
    throw new Error('fant ikke saksId');
  }

  const { data: historikk, mutate } = useSWR(
    `sak/${params.saksId}/historikk`,
    () => clientHentSakshistorikk(params.saksId),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  return {
    historikk,
    refetchSaksHistorikkClient: mutate,
  };
}
