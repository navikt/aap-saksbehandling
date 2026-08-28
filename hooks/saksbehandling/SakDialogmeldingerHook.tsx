'use client';

import useSWR from 'swr';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { DialogmeldingMedDokumenter } from 'lib/types/dialogmelding';
import { isError } from 'lib/utils/api';
import { hentAlleDialogmeldingerMedDokumentIdPåSak } from 'lib/clientApi';

export function useDialogmeldinger(): {
  dialogmeldingerMedDokumentliste?: DialogmeldingMedDokumenter[];
  refetchDialogmeldingerClient: () => void;
} {
  const params = useParamsMedType();

  if (!params.saksnummer) {
    throw new Error('fant ikke saksnummer');
  }

  const { data, mutate } = useSWR(
    `api/dokumentinnhenting/syfo/dialogmeldinger/${params.saksnummer}`,
    () => hentAlleDialogmeldingerMedDokumentIdPåSak(params.saksnummer),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  return {
    dialogmeldingerMedDokumentliste: !isError(data) ? data?.data : undefined,
    refetchDialogmeldingerClient: mutate,
  };
}
