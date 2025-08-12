import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FlytProsesseringStatus } from 'lib/types/types';
import { clientSendHendelse } from 'lib/clientApi';
import { FlytProsesseringServerSentEvent } from 'app/saksbehandling/api/behandling/hent/[referanse]/prosessering/route';
import { ApiException } from 'lib/utils/api';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';
import { useRouter } from 'next/navigation';

export type SendHendelseOgVentPåProsesseringStatus =
  | FlytProsesseringStatus
  | 'CLIENT_ERROR'
  | 'CLIENT_CONFLICT'
  | undefined;

export const useSendHendelseOgVentPåProsessering = (): {
  status: SendHendelseOgVentPåProsesseringStatus;
  isLoading: boolean;
  sendHendelseOgVentPåProsessering: (saksnummer: string, hendelse: Object, onSuccess?: () => void) => void;
  sendHendelseError?: ApiException;
} => {
  const params = useParams<{ behandlingsReferanse: string }>();
  const [status, setStatus] = useState<SendHendelseOgVentPåProsesseringStatus>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | undefined>();
  const { refetchFlytClient } = useFlyt();
  const router = useRouter();

  const sendHendelseOgVentPåProsessering = async (saksnummer: string, hendelse: Object, onSuccess?: () => void) => {
    setError(undefined);
    setIsLoading(true);
    setStatus(undefined);

    const sendHendelseResultat = await clientSendHendelse(saksnummer, hendelse);
    if (sendHendelseResultat.type === 'ERROR') {
      setError(sendHendelseResultat.apiException);
      if (sendHendelseResultat.status === 409) {
        setStatus('CLIENT_CONFLICT');
      } else {
        setStatus('CLIENT_ERROR');
      }
      setIsLoading(false);
      return;
    }
    listenSSE(saksnummer, onSuccess);
  };

  const listenSSE = (saksnummer: string, onSuccess?: () => void) => {
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
        refetchFlytClient();
        setIsLoading(false);
        onSuccess && onSuccess();
        router.push(`/saksbehandling/sak/${saksnummer}/${params.behandlingsReferanse}`);
        router.refresh();
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

  return { isLoading, status, sendHendelseOgVentPåProsessering, sendHendelseError: error };
};
