import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FlytProsesseringStatus, LøsAvklaringsbehovPåBehandling } from 'lib/types/types';
import { clientLøsBehov } from 'lib/clientApi';
import { FlytProsesseringServerSentEvent } from 'app/api/behandling/hent/[referanse]/prosessering/route';
import { revalidateFlyt } from 'lib/actions/actions';

export const useLøsBehovOgVentPåProsessering = (): {
  status: FlytProsesseringStatus | undefined;
  isLoading: boolean;
  løsBehovOgVentPåProsessering: (behov: LøsAvklaringsbehovPåBehandling) => void;
} => {
  const params = useParams<{ behandlingsReferanse: string }>();
  const [status, setStatus] = useState<FlytProsesseringServerSentEvent['status'] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const løsBehovOgVentPåProsessering = async (behov: LøsAvklaringsbehovPåBehandling) => {
    await clientLøsBehov(behov);
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
        setIsLoading(false);
      }
      if (eventData.status === 'FEILET') {
        console.log('ERROR', eventData);
        setStatus(eventData.status);
        eventSource.close();
      }
    };
    eventSource.onerror = (event: Event) => {
      throw new Error(`event onError ${JSON.stringify(event)}`);
    };
  };

  return { isLoading, status, løsBehovOgVentPåProsessering };
};
