import { useState, useTransition } from 'react';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { useParams, useRouter } from 'next/navigation';
import { LøsAvklaringsbehovPåBehandling, StegType } from 'lib/types/types';
import { clientHentFlyt, clientLøsBehov, clientSjekkTilgang } from 'lib/clientApi';
import { useIngenFlereOppgaverModal } from 'hooks/IngenFlereOppgaverModalHook';
import { ApiException, isError, isSuccess } from 'lib/utils/api';
import { useRequiredFlyt } from './FlytHook';

export type LøsBehovOgGåTilNesteStegStatus = ServerSentEventStatus | undefined;

export function useLøsBehovOgGåTilNesteSteg(steg: StegType): {
  løsBehovOgGåTilNesteStegError?: ApiException;
  status: LøsBehovOgGåTilNesteStegStatus;
  isLoading: boolean;
  løsBehovOgGåTilNesteSteg: (behov: LøsAvklaringsbehovPåBehandling) => void;
} {
  const params = useParams<{ aktivGruppe: string; behandlingsReferanse: string; saksId: string }>();
  const router = useRouter();
  const { refetchFlytClient } = useRequiredFlyt();
  const { setIsModalOpen } = useIngenFlereOppgaverModal();

  const [status, setStatus] = useState<LøsBehovOgGåTilNesteStegStatus>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | undefined>();
  const [isPending, startTransition] = useTransition();

  const løsBehovOgGåTilNesteSteg = async (behov: LøsAvklaringsbehovPåBehandling) => {
    setIsLoading(true);
    setStatus(undefined);
    setError(undefined);

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
    const eventSource = new EventSource(
      `/saksbehandling/api/behandling/hent/${params.behandlingsReferanse}/${params.aktivGruppe}/${steg}/nesteSteg/`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = async (event: any) => {
      const eventData: ServerSentEventData = JSON.parse(event.data);
      if (eventData.status === 'DONE') {
        eventSource.close();

        if (eventData.skalBytteGruppe || eventData.skalBytteSteg) {
          router.push(
            `/saksbehandling/sak/${params.saksId}/${params.behandlingsReferanse}/${eventData.aktivGruppe}/#${eventData.aktivtSteg}`
          );
        }

        startTransition(() => {
          router.refresh();
          refetchFlytClient();
        });

        if (eventData.skalBytteSteg && eventData.aktivtStegBehovsKode) {
          // Aktivt steg kan ha flere definisjonskoder. Velger å ikke vise modal dersom brukeren har tilgang til minst én av de
          const harTilgang = (
            await Promise.all(
              eventData.aktivtStegBehovsKode.map((kode) => clientSjekkTilgang(params.behandlingsReferanse, kode))
            )
          ).some((tilgangResponse) => isSuccess(tilgangResponse) && tilgangResponse.data.tilgang);

          // Brev har ingen egen definisjonskode som vi kan hente ut fra steget. Må skrives om i backend
          if (!harTilgang && eventData.aktivtSteg !== 'BREV') {
            setIsModalOpen(true);
          }
        }

        setIsLoading(false);
      }

      if (eventData.status === 'ERROR') {
        setStatus(eventData.status);
        eventSource.close();
        setIsLoading(false);
        router.refresh();
      }
      if (eventData.status === 'POLLING') {
        setStatus(eventData.status);
        setIsLoading(false);
      }
    };
    eventSource.onerror = (event: any) => {
      throw new Error('event onError', event);
    };
  };

  return {
    isLoading: isLoading || isPending,
    status,
    løsBehovOgGåTilNesteSteg,
    løsBehovOgGåTilNesteStegError: error,
  };
}
