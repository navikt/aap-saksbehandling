import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FlytProsesseringStatus, LøsAvklaringsbehovPåBehandling } from 'lib/types/types';
import { clientHentFlyt, clientLøsBehov } from 'lib/clientApi';
import { FlytProsesseringServerSentEvent } from 'app/saksbehandling/api/behandling/hent/[referanse]/prosessering/route';
import { revalidateFlyt } from 'lib/actions/actions';
import { ApiException, isError, isSuccess } from 'lib/utils/api';
import { useFlyt } from 'hooks/FlytHook';

export type LøsBehovOgVentPåProsesseringStatus = FlytProsesseringStatus | undefined;

export function useLøsBehovOgVentPåProsessering(): {
  status: LøsBehovOgVentPåProsesseringStatus;
  isLoading: boolean;
  løsBehovOgVentPåProsessering: (behov: LøsAvklaringsbehovPåBehandling) => void;
  løsBehovError?: ApiException;
} {
  const params = useParams<{ behandlingsReferanse: string }>();
  const [status, setStatus] = useState<LøsBehovOgVentPåProsesseringStatus>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | undefined>();
  const { refetchFlytClient } = useFlyt();

  const løsBehovOgVentPåProsessering = async (behov: LøsAvklaringsbehovPåBehandling) => {
    setError(undefined);
    setIsLoading(true);
    setStatus(undefined);

    const løsbehovRes = await clientLøsBehov(behov);
    if (isError(løsbehovRes)) {
      if (løsbehovRes.status === 409) {
        // Henter siste versjon av flyt for å bruke siste behandlingversjon
        const flytResponse = await clientHentFlyt(params.behandlingsReferanse);

        if (isSuccess(flytResponse)) {
          const clientLøsBehovEtterConflict = await clientLøsBehov({
            ...behov,
            behandlingVersjon: flytResponse.data.behandlingVersjon,
          });

          if (isError(clientLøsBehovEtterConflict)) {
            setError(clientLøsBehovEtterConflict.apiException);
            setIsLoading(false);
            return;
          }
        }
      } else {
        setError(løsbehovRes.apiException);
        setIsLoading(false);
        return;
      }
    }
    listenSSE();
  };

  const listenSSE = () => {
    setIsLoading(true);
    const eventSource = new EventSource(
      `/saksbehandling/api/behandling/hent/${params.behandlingsReferanse}/prosessering/`,
      {
        withCredentials: true,
      }
    );

    eventSource.onmessage = async (event: any) => {
      const eventData: FlytProsesseringServerSentEvent = JSON.parse(event.data);
      if (eventData.status === 'FERDIG') {
        eventSource.close();
        await revalidateFlyt(params.behandlingsReferanse);
        refetchFlytClient();
        setIsLoading(false);
      }
      if (eventData.status === 'FEILET') {
        setStatus(eventData.status);
        eventSource.close();
      }
    };
    eventSource.onerror = (event: Event) => {
      throw new Error(`event onError ${JSON.stringify(event)}`);
    };
  };

  return { isLoading, status, løsBehovOgVentPåProsessering, løsBehovError: error };
}
