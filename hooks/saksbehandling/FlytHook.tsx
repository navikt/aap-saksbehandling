'use client';

import { BehandlingFlytOgTilstand } from 'lib/types/types';
import useSWR from 'swr';
import { clientHentFlyt } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

export function useFlyt(): {
  flyt?: BehandlingFlytOgTilstand;
  refetchFlytClient: () => void;
} {
  const params = useParamsMedType();

  if (!params.behandlingsreferanse) {
    throw Error('useFlyt kan bare brukes på behandlingssiden.');
  }

  const { data, mutate } = useSWR(
    `api/flyt/${params.behandlingsreferanse}`,
    () => clientHentFlyt(params.behandlingsreferanse),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  return {
    flyt: isSuccess(data) ? data?.data : undefined,
    refetchFlytClient: mutate,
  };
}
