'use client';

import { BehandlingFlytOgTilstand } from 'lib/types/postmottakTypes';
import { postmottakHentFlyt } from 'lib/postmottakClientApi';
import useSWR from 'swr';
import { isError } from 'lib/utils/api';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

export function usePostmottakRequiredFlyt(): { flyt: BehandlingFlytOgTilstand } {
  const params = useParamsMedType();

  if (!params.behandlingsreferanse) {
    throw Error('usePostmottakRequiredFlyt kan bare brukes i postmottak.');
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
    throw new Error('Kunne ikke finne påkrevd flyt i postmottak.');
  }

  return { flyt: flyt.data };
}
