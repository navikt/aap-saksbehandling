'use client';

import { BehandlingFlytOgTilstand } from 'lib/types/types';
import useSWR from 'swr';
import { clientHentFlyt } from 'lib/clientApi';
import { isError, isSuccess } from 'lib/utils/api';
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

export function useRequiredFlyt(): { flyt: BehandlingFlytOgTilstand; refetchFlytClient: () => void } {
  const params = useParamsMedType();

  if (!params.behandlingsreferanse) {
    throw Error('useFlyt kan bare brukes på behandlingssiden.');
  }

  const { data: flyt, mutate } = useSWR(
    `api/flyt/${params.behandlingsreferanse}`,
    () => clientHentFlyt(params.behandlingsreferanse),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  if (isError(flyt)) {
    throw new Error(
      `Feil oppsto ved henting av påkrevd flyt: ${flyt.apiException.message} med kode ${flyt.apiException.code} og status ${flyt.status}`
    );
  } else if (!flyt) {
    throw new Error('Kunne ikke finne påkrevd flyt');
  }

  return { flyt: flyt.data, refetchFlytClient: mutate };
}
