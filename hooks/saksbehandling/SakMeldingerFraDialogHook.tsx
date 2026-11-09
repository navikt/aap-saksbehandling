'use client';

import useSWR from 'swr';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError, isSuccess } from 'lib/utils/api';
import { hentAlleDialogmeldingerMedDokumentIdPåSak } from 'lib/clientApi';
import { KommendeMeldingDto, MeldingMedDokumenterDto } from 'lib/types/types';
import { useRef } from 'react';

export function useMeldingerFraDialog(): {
  meldingerMedDokumentliste?: MeldingMedDokumenterDto[];
  kommendeMeldinger?: KommendeMeldingDto[];
  isLoading: boolean;
  error?: string;
  refetchDialogmeldingerClient: () => Promise<unknown>;
} {
  const params = useParamsMedType();
  const refreshIntervalRetries = useRef(0);

  if (!params.saksnummer) {
    throw new Error('fant ikke saksnummer');
  }

  const { data, mutate, isLoading } = useSWR(
    `api/dokumentinnhenting/syfo/dialogmeldinger/${params.saksnummer}`,
    () => hentAlleDialogmeldingerMedDokumentIdPåSak(params.saksnummer),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      // Når vi sender en forespørsel til behandler kan det ta noe tid før vi får svar tilbake fra syfo.
      // Vi legger derfor inn en refreshInterval som sjekker om vi har fått inn dokumentIdListe,
      // sånn at vi kan vise utgående journalført dokument i dialogvinduet.
      refreshInterval: (response) => {
        if (isSuccess(response)) {
          if (response.data.meldinger.some(({ dokumentIdListe }) => dokumentIdListe.length === 0)) {
            refreshIntervalRetries.current += 1;
            if (refreshIntervalRetries.current > 3) {
              return 0;
            }
            return 1000;
          } else {
            return 0;
          }
        }
        return 0;
      },
    }
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
