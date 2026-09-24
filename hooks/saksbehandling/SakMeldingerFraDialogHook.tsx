'use client';

import useSWR from 'swr';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError, isSuccess } from 'lib/utils/api';
import { hentAlleDialogmeldingerMedDokumentIdPåSak } from 'lib/clientApi';
import { KommendeMeldingDto, MeldingMedDokumenterDto } from 'lib/types/types';

export function useMeldingerFraDialog(): {
  meldingerMedDokumentliste?: MeldingMedDokumenterDto[];
  kommendeMeldinger?: KommendeMeldingDto[];
  isLoading: boolean;
  error?: string;
  refetchDialogmeldingerClient: () => Promise<unknown>;
} {
  const params = useParamsMedType();

  if (!params.saksnummer) {
    throw new Error('fant ikke saksnummer');
  }

  const { data, mutate, isLoading } = useSWR(
    `api/dokumentinnhenting/syfo/dialogmeldinger/${params.saksnummer}`,
    () => hentAlleDialogmeldingerMedDokumentIdPåSak(params.saksnummer),
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );

  const response = isSuccess(data) ? data.data : undefined;

  return {
    meldingerMedDokumentliste: response?.meldinger,
    kommendeMeldinger: response?.kommendeMeldinger,
    isLoading,
    error: isError(data) ? data.apiException.message : undefined,
    refetchDialogmeldingerClient: mutate,
  };
}
