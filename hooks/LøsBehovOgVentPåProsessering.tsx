import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FlytProsesseringStatus, LøsAvklaringsbehovPåBehandling } from 'lib/types/types';
import { clientLøsBehov } from 'lib/clientApi';
import { FlytProsesseringServerSentEvent } from 'app/saksbehandling/api/behandling/hent/[referanse]/prosessering/route';
import { revalidateFlyt } from 'lib/actions/actions';
import { ApiException } from 'lib/utils/api';
import { useFlyt } from 'hooks/FlytHook';

export type LøsBehovOgVentPåProsesseringStatus =
  | FlytProsesseringStatus
  | 'CLIENT_ERROR'
  | 'CLIENT_CONFLICT'
  | undefined;

export const useLøsBehovOgVentPåProsessering = (): {
  status: LøsBehovOgVentPåProsesseringStatus;
  isLoading: boolean;
  løsBehovOgVentPåProsessering: (behov: LøsAvklaringsbehovPåBehandling) => void;
  løsBehovError?: ApiException;
} => {
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
    if (løsbehovRes.type === 'ERROR') {
      setError(løsbehovRes.apiException);
      if (løsbehovRes.status === 409) {
        setStatus('CLIENT_CONFLICT');
      } else {
        setStatus('CLIENT_ERROR');
      }
      setIsLoading(false);
      return;
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
};
