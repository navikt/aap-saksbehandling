'use client';

import useSWR from 'swr';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { FellesDialogmeldingDto } from 'lib/types/dialogmelding';
import { isError } from 'lib/utils/api';
import { clientHentDialogmeldingerForSak } from 'lib/dokumentClientApi';

export function useDialogmeldinger(): {
  dialogmeldinger?: FellesDialogmeldingDto[];
  refetchDialogmeldingerClient: () => void;
} {
  const params = useParamsMedType();

  if (!params.saksnummer) {
    throw new Error('fant ikke saksnummer');
  }

  const { data, mutate } = useSWR(
    `api/dialogmelding/${params.saksnummer}/dialogmeldinger`,
    () => clientHentDialogmeldingerForSak(params.saksnummer),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  return {
    dialogmeldinger: !isError(data) ? data?.data : undefined,
    refetchDialogmeldingerClient: mutate,
  };
}
