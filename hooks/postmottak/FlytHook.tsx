'use client';

import { BehandlingFlytOgTilstand } from 'lib/types/postmottakTypes';
import { useParams } from 'next/navigation';
import { postmottakHentFlyt } from 'lib/postmottakClientApi';
import useSWR from 'swr';
import { isError } from 'lib/utils/api';

export function useRequiredFlyt(): { flyt: BehandlingFlytOgTilstand } {
  const params = useParams<{ behandlingsreferanse: string }>();

  if (!params.behandlingsreferanse) {
    throw Error('useRequiredFlyt kan bare brukes i postmottak.');
  }

  const { data: flyt } = useSWR(
    `postmottak/api/post/${params.behandlingsreferanse}/flyt`,
    () => postmottakHentFlyt(params.behandlingsreferanse),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  if (isError(flyt) || !flyt) {
    throw new Error('Kunne ikke finne påkrevd flyt');
  }

  return { flyt: flyt.data };
}
