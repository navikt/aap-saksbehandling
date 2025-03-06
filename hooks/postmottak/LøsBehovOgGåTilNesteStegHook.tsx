import { useState } from 'react';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/postmottak/api/post/[behandlingsreferanse]/hent/[gruppe]/[steg]/nesteSteg/route';
import { useParams, useRouter } from 'next/navigation';
import { LøsAvklaringsbehovPåBehandling, StegType } from 'lib/types/postmottakTypes';
import { løsBehov } from 'lib/postmottakClientApi';

export const useLøsBehovOgGåTilNesteSteg = (
  steg: StegType
): {
  status: ServerSentEventStatus | undefined;
  isLoading: boolean;
  løsBehovOgGåTilNesteSteg: (behov: LøsAvklaringsbehovPåBehandling) => void;
} => {
  const params = useParams<{ aktivGruppe: string; behandlingsreferanse: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<ServerSentEventStatus | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const løsBehovOgGåTilNesteSteg = async (behov: LøsAvklaringsbehovPåBehandling) => {
    await løsBehov(behov);
    listenSSE();
  };
  const listenSSE = () => {
    setIsLoading(true);
    const eventSource = new EventSource(
      `/postmottak/api/post/${params.behandlingsreferanse}/hent/${params.aktivGruppe}/${steg}/nesteSteg/`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = async (event: any) => {
      const eventData: ServerSentEventData = JSON.parse(event.data);
      if (eventData.status === 'DONE') {
        eventSource.close();
        if (eventData.skalBytteGruppe || eventData.skalBytteSteg) {
          // TODO: Legge tilbake igjen hash for aktivt-steg hvis vi tar i bruk dette?
          router.push(`/${params.behandlingsreferanse}/${eventData.aktivGruppe}/`);
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
