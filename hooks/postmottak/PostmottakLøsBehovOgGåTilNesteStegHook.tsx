import { useRef, useState, useTransition } from 'react';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/postmottak/api/post/[behandlingsreferanse]/hent/[gruppe]/[steg]/nesteSteg/route';
import { useRouter } from 'next/navigation';
import { LøsAvklaringsbehovPåBehandling, StegType } from 'lib/types/postmottakTypes';
import { postmottakLøsBehovClient } from 'lib/postmottakClientApi';
import { ApiException, isError, isSuccess } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';
import { hentTildeltStatusClient } from 'lib/oppgaveClientApi';
import { useOverstyrTildelingHook } from 'hooks/saksbehandling/OverstyrTildelingHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

export const usePostmottakLøsBehovOgGåTilNesteSteg = (
  steg: StegType
): {
  status: ServerSentEventStatus | undefined;
  resetStatus: () => void;
  isLoading: boolean;
  løsBehovOgGåTilNesteSteg: (behov: LøsAvklaringsbehovPåBehandling, sjekkTildeltStatus?: boolean) => void;
  løsBehovOgGåTilNesteStegError?: ApiException;
} => {
  const params = useParamsMedType();
  const router = useRouter();
  const [status, setStatus] = useState<ServerSentEventStatus | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | undefined>();
  const [isPending, startTransition] = useTransition();
  const { setVisOverstyrModal, setCallback, setReservertAvNavn } = useOverstyrTildelingHook();

  const erLokal = isLocal();
  const sisteBehovRef = useRef<{
    behov: LøsAvklaringsbehovPåBehandling;
  }>(null);

  const løsBehovOgGåTilNesteSteg = async (
    behov: LøsAvklaringsbehovPåBehandling,
    sjekkTildeltStatus: boolean = true
  ) => {
    setIsLoading(true);
    setStatus(undefined);
    setError(undefined);

    if (sjekkTildeltStatus && !erLokal) {
      const nyesteOppgavePåBehandling = await hentTildeltStatusClient(params.behandlingsreferanse);
      if (isSuccess(nyesteOppgavePåBehandling)) {
        if (
          nyesteOppgavePåBehandling.data.tildeltSaksbehandlerIdent != null &&
          !nyesteOppgavePåBehandling.data.erTildeltInnloggetBruker
        ) {
          setVisOverstyrModal(true);
          setReservertAvNavn(
            nyesteOppgavePåBehandling.data.tildeltSaksbehandlerNavn ??
              nyesteOppgavePåBehandling.data.tildeltSaksbehandlerIdent
          );
          setIsLoading(false);
          setCallback(() => bekreftOgFortsett);
          sisteBehovRef.current = { behov };
          return;
        }
      } // Hvis henting av tildelt-status feiler, la saksbehandler fortsette
    }

    const løsbehovRes = await postmottakLøsBehovClient(behov);
    if (isError(løsbehovRes)) {
      setError(løsbehovRes.apiException);
      setIsLoading(false);
      return;
    }
    listenSSE();
  };
  const listenSSE = () => {
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
          router.push(`/postmottak/${params.behandlingsreferanse}/${eventData.aktivGruppe}/`);
        }
        startTransition(() => {
          router.refresh();
        });
        setIsLoading(false);
      }
      if (eventData.status === 'ERROR') {
        setStatus(eventData.status);
        eventSource.close();
      }
      if (eventData.status === 'POLLING') {
        setStatus(eventData.status);
      }
    };
    eventSource.onerror = (event: any) => {
      throw new Error('event onError', event);
    };
  };

  function resetStatus() {
    setStatus(undefined);
  }

  const bekreftOgFortsett = () => {
    if (!sisteBehovRef.current) {
      setError({ message: 'Noe gikk galt ved overstyring av tildeling. Prøv igjen.' });
      return;
    }
    sisteBehovRef.current && løsBehovOgGåTilNesteSteg(sisteBehovRef.current.behov, false);
  };

  return {
    isLoading: isLoading || isPending,
    status,
    resetStatus,
    løsBehovOgGåTilNesteSteg,
    løsBehovOgGåTilNesteStegError: error,
  };
};
