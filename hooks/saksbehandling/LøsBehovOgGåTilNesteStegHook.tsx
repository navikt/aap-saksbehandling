import { useState, useTransition } from 'react';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { useParams, useRouter } from 'next/navigation';
import { LøsAvklaringsbehovPåBehandling, StegType } from 'lib/types/types';
import {
  clientHentFlyt,
  clientHentTilgangForKvalitetssikring,
  clientLøsBehov,
  clientSjekkTilgang,
} from 'lib/clientApi';
import { useIngenFlereOppgaverModal } from 'hooks/saksbehandling/IngenFlereOppgaverModalHook';
import { ApiException, isError, isSuccess } from 'lib/utils/api';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { isDev } from '../../lib/utils/environment';

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
      const { status, skalBytteGruppe, skalBytteSteg, aktivGruppe, aktivtSteg, aktivtStegBehovsKode } = eventData;

      if (status === 'DONE') {
        eventSource.close();
        let kanFortsetteSaksbehandling = false;
        const skalKvalitetssikre = !!aktivtSteg && ['KVALITETSSIKRING', 'AVKLAR_STUDENT', 'AVKLAR_SYKDOM', 'AVKLAR_OPPFØLGING'].includes(aktivtSteg);

        // TODO Fjerne feature toggle etter verifisering i dev
        if (isDev() && skalKvalitetssikre) {
          const kanFortsetteSaksbehandlingRespons = await clientHentTilgangForKvalitetssikring(
            params.behandlingsReferanse
          );
          if (isSuccess(kanFortsetteSaksbehandlingRespons)) {
            kanFortsetteSaksbehandling = kanFortsetteSaksbehandlingRespons.data.harTilgangTilÅKvalitetssikre;
          }
        } else {
          if (skalBytteSteg && aktivtStegBehovsKode) {
            kanFortsetteSaksbehandling = (
              await Promise.all(
                aktivtStegBehovsKode.map((kode) => clientSjekkTilgang(params.behandlingsReferanse, kode))
              )
            ).some((tilgangResponse) => isSuccess(tilgangResponse) && tilgangResponse.data.tilgang);
          }
        }

        // TODO Brev har ingen egen definisjonskode som vi kan hente ut fra steget. Må skrives om i backend
        if (!kanFortsetteSaksbehandling && aktivtSteg !== 'BREV') {
          setIsModalOpen(true);
        } else {
          if (skalBytteGruppe || skalBytteSteg) {
            router.push(
              `/saksbehandling/sak/${params.saksId}/${params.behandlingsReferanse}/${aktivGruppe}/#${aktivtSteg}`
            );
          }

          startTransition(() => {
            router.refresh();
            refetchFlytClient();
          });
        }

        setIsLoading(false);
      }

      if (status === 'ERROR') {
        setStatus(status);
        eventSource.close();
        setIsLoading(false);
        router.refresh();
      }
      if (status === 'POLLING') {
        setStatus(status);
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
