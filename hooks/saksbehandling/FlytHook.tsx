'use client';

import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { clientHentFlyt } from 'lib/clientApi';

export function useFlyt(): {
  flyt?: BehandlingFlytOgTilstand;
  refetchFlytClient: () => void;
} {
  const params = useParams<{ behandlingsReferanse: string }>();

  if (!params.behandlingsReferanse) {
    throw Error('useFlyt kan bare brukes på behandlingssiden.');
  }

  const { data, mutate } = useSWR(
    `api/flyt/${params.behandlingsReferanse}`,
    () => clientHentFlyt(params.behandlingsReferanse),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  return {
    flyt: data?.type === 'SUCCESS' ? data?.data : undefined,
    refetchFlytClient: mutate,
  };
}

export function useRequiredFlyt(): { flyt: BehandlingFlytOgTilstand; refetchFlytClient: () => void } {
  const params = useParams<{ behandlingsReferanse: string }>();

  if (!params.behandlingsReferanse) {
    throw Error('useFlyt kan bare brukes på behandlingssiden.');
  }

  const { data: flyt, mutate } = useSWR(
    `api/flyt/${params.behandlingsReferanse}`,
    () => clientHentFlyt(params.behandlingsReferanse),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  if (flyt?.type === 'ERROR' || !flyt) {
    throw new Error('Kunne ikke finne påkrevd flyt');
  }

  return { flyt: flyt.data, refetchFlytClient: mutate };
}
