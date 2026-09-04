'use client';

import useSWR from 'swr';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError } from 'lib/utils/api';
import { hentAlleDialogmeldingerMedDokumentIdPåSak } from 'lib/clientApi';
import { MeldingMedDokumenterDto } from 'lib/types/types';

export function useMeldingerFraDialog(): {
  meldingerMedDokumenliste?: MeldingMedDokumenterDto[];
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
    meldingerMedDokumenliste: !isError(data) ? data?.data : undefined,
    refetchDialogmeldingerClient: mutate,
  };
}
