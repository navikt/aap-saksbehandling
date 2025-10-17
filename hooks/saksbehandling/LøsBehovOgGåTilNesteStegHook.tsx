import { useState, useTransition } from 'react';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { useParams, useRouter } from 'next/navigation';
import { FatteVedtakLøsning, KvalitetssikringLøsning, LøsAvklaringsbehovPåBehandling, LøsPeriodisertBehovPåBehandling, StegType } from 'lib/types/types';
import {
  clientHentFlyt,
  clientHentTilgangForKvalitetssikring,
  clientLøsBehov,
  clientLøsPeriodisertBehov,
  clientSjekkTilgang,
} from 'lib/clientApi';
import { useIngenFlereOppgaverModal } from 'hooks/saksbehandling/IngenFlereOppgaverModalHook';
import { ApiException, isError, isSuccess } from 'lib/utils/api';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { Behovstype } from 'lib/utils/form';

export type LøsBehovOgGåTilNesteStegStatus = ServerSentEventStatus | undefined;

export function useLøsBehovOgGåTilNesteSteg(steg: StegType): {
  løsBehovOgGåTilNesteStegError?: ApiException;
  status: LøsBehovOgGåTilNesteStegStatus;
  isLoading: boolean;
  løsBehovOgGåTilNesteSteg: (behov: LøsAvklaringsbehovPåBehandling, callback?: () => void) => void;
  løsPeriodisertBehovOgGåTilNesteSteg: (behov: LøsPeriodisertBehovPåBehandling, callback?: () => void) => void;
} {
  const params = useParams<{ aktivGruppe: string; behandlingsReferanse: string; saksId: string }>();
  const router = useRouter();
  const { refetchFlytClient } = useRequiredFlyt();
  const { setIsModalOpen } = useIngenFlereOppgaverModal();

  const [status, setStatus] = useState<LøsBehovOgGåTilNesteStegStatus>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | undefined>();
  const [isPending, startTransition] = useTransition();

  const løsBehovOgGåTilNesteSteg = async (
    behov: LøsAvklaringsbehovPåBehandling | LøsPeriodisertBehovPåBehandling,
    erPeriodisert: boolean,
    callback?: () => void
  ) => {
    setIsLoading(true);
    setStatus(undefined);
    setError(undefined);

    const løsbehovRes = erPeriodisert
      ? await clientLøsPeriodisertBehov(behov as LøsPeriodisertBehovPåBehandling)
      : await clientLøsBehov(behov);
    if (isError(løsbehovRes)) {
      if (løsbehovRes.status === 409) {
        // Henter siste versjon av flyt for å bruke siste behandlingversjon
        const flytResponse = await clientHentFlyt(params.behandlingsReferanse);

        if (isSuccess(flytResponse)) {
          const clientLøsBehovEtterConflict = erPeriodisert
            ? await clientLøsPeriodisertBehov({
                ...(behov as LøsPeriodisertBehovPåBehandling), // TODO: Rydd opp i typene
                behandlingVersjon: flytResponse.data.behandlingVersjon,
              })
            : await clientLøsBehov({
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

    // TODO: Avgjørelse om visning av modalen "Du har fullført oppgaven" bør skje i backend og sendes som en boolean til frontend
    const underkjennelseIKvalitetssikringEllerBeslutning = () => {
      const brukerHarKvalitetssikret = behov.behov.behovstype === Behovstype.KVALITETSSIKRING_KODE;
      const brukerHarBesluttet = behov.behov.behovstype === Behovstype.FATTE_VEDTAK_KODE;

      if (brukerHarKvalitetssikret || brukerHarBesluttet) {
        const løsning = behov.behov as KvalitetssikringLøsning | FatteVedtakLøsning;
        const detFinnesEnUnderkjentVurdering = løsning.vurderinger.some((vurdering) => vurdering.godkjent === false);
        return detFinnesEnUnderkjentVurdering;
      }
      return false;
    };

    listenSSE(underkjennelseIKvalitetssikringEllerBeslutning()).then(() => {
      if (callback) {
        callback();
      }
    });
  };

  const listenSSE = async (underkjennelseIKvalitetssikringEllerBeslutning: boolean) => {
    const eventSource = new EventSource(
      `/saksbehandling/api/behandling/hent/${params.behandlingsReferanse}/${params.aktivGruppe}/${steg}/nesteSteg/`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = async (event: any) => {
      const eventData: ServerSentEventData = JSON.parse(event.data);
      const {
        status,
        skalBytteGruppe,
        skalBytteSteg,
        aktivVisningGruppe,
        aktivtVisningSteg,
        aktivtStegBehovsKode,
        gjeldendeSteg,
      } = eventData;

      if (status === 'DONE') {
        eventSource.close();
        let kanFortsetteSaksbehandling = false;
        const skalKvalitetssikre = gjeldendeSteg === 'KVALITETSSIKRING';

        if (skalKvalitetssikre) {
          const kanFortsetteSaksbehandlingRespons = await clientHentTilgangForKvalitetssikring(
            params.behandlingsReferanse
          );
          if (isSuccess(kanFortsetteSaksbehandlingRespons)) {
            kanFortsetteSaksbehandling = kanFortsetteSaksbehandlingRespons.data.harTilgangTilÅKvalitetssikre;
          }
        } else {
          if (aktivtStegBehovsKode) {
            kanFortsetteSaksbehandling = (
              await Promise.all(
                aktivtStegBehovsKode.map((kode) => clientSjekkTilgang(params.behandlingsReferanse, kode))
              )
            ).some((tilgangResponse) => isSuccess(tilgangResponse) && tilgangResponse.data.tilgang);
          }
        }

        // TODO: Avgjørelse om visning av modalen "Du har fullført oppgaven" bør skje i backend og sendes som en boolean til frontend
        const saksbehandlerHarSendtTilBeslutter = gjeldendeSteg === 'FATTE_VEDTAK' && skalBytteGruppe;

        // TODO Brev har ingen egen definisjonskode som vi kan hente ut fra steget. Må skrives om i backend
        if (
          (!kanFortsetteSaksbehandling && aktivtVisningSteg !== 'BREV') ||
          underkjennelseIKvalitetssikringEllerBeslutning ||
          saksbehandlerHarSendtTilBeslutter
        ) {
          setIsModalOpen(true);
        } else {
          if (skalBytteGruppe || skalBytteSteg) {
            router.push(
              `/saksbehandling/sak/${params.saksId}/${params.behandlingsReferanse}/${aktivVisningGruppe}/#${aktivtVisningSteg}`
            );
          }
        }

        startTransition(() => {
          router.refresh();
          refetchFlytClient();
        });

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
      }
    };
    eventSource.onerror = (event: any) => {
      throw new Error('event onError', event);
    };
  };

  return {
    isLoading: isLoading || isPending,
    status,
    løsBehovOgGåTilNesteSteg: (behov, callback) => løsBehovOgGåTilNesteSteg(behov, false, callback),
    løsPeriodisertBehovOgGåTilNesteSteg: (behov, callback) => løsBehovOgGåTilNesteSteg(behov, true, callback),
    løsBehovOgGåTilNesteStegError: error,
  };
}
