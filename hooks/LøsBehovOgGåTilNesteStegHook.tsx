import { useState } from 'react';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { useParams, useRouter } from 'next/navigation';
import { LøsAvklaringsbehovPåBehandling, StegType } from 'lib/types/types';
import { løsBehov } from 'lib/clientApi';

export const useLøsBehovOgGåTilNesteSteg = (
  steg: StegType
): {
  status: ServerSentEventStatus | undefined;
  isLoading: boolean;
  løsBehovOgGåTilNesteSteg: (behov: LøsAvklaringsbehovPåBehandling) => void;
} => {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<ServerSentEventStatus | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const løsBehovOgGåTilNesteSteg = async (behov: LøsAvklaringsbehovPåBehandling) => {
    await løsBehov(behov);
    await listenSSE();
  };
  const listenSSE = () => {
    setIsLoading(true);
    const eventSource = new EventSource(
      `/api/behandling/hent/${params.behandlingsReferanse}/${params.aktivGruppe}/${steg}/nesteSteg/`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = (event: any) => {
      const eventData: ServerSentEventData = JSON.parse(event.data);
      if (eventData.status === 'DONE') {
        eventSource.close();
        if (eventData.skalBytteGruppe || eventData.skalBytteSteg) {
          router.push(
            `/sak/${params.saksId}/${params.behandlingsReferanse}/${eventData.aktivGruppe}/#${eventData.aktivtSteg}`
          );
        }
        router.refresh();
        setIsLoading(false);
      }
      if (eventData.status === 'ERROR') {
        console.log('ERROR', eventData);
        setStatus(eventData.status);
        eventSource.close();
      }
      if (eventData.status === 'POLLING') {
        setStatus(eventData.status);
        console.log('POLLING', eventData);
      }
    };
    eventSource.onerror = (event: any) => {
      throw new Error('event onError', event);
    };
  };

  return { isLoading, status, løsBehovOgGåTilNesteSteg };
};
