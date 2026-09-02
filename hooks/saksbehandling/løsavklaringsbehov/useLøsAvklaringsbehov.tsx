import { useState, useTransition } from 'react';
import { ServerSentEventStatus } from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { useRouter } from 'next/navigation';
import { LøsAvklaringsbehovPåBehandling, LøsPeriodisertBehovPåBehandling, StegType } from 'lib/types/types';
import { useIngenFlereOppgaverModal } from 'hooks/saksbehandling/IngenFlereOppgaverModalHook';
import { ApiException, isError } from 'lib/utils/api';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { isLocal } from 'lib/utils/environment';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useTildelingssjekk } from 'hooks/saksbehandling/løsavklaringsbehov/useTildelingssjekk';
import { løsAvklaringsbehovMedRetry } from 'hooks/saksbehandling/løsavklaringsbehov/løsAvklaringsbehovConflictRetry';
import { listenSSE } from 'hooks/saksbehandling/løsavklaringsbehov/listenSSE';
import {
  harUnderkjentVurdering,
  skalViseIngenFlereOppgaverModal,
} from 'hooks/saksbehandling/løsavklaringsbehov/skalViseIngenFlereOppgaverModal';

export type LøsBehovOgGåTilNesteStegStatus = ServerSentEventStatus | undefined;

export function useLøsAvklaringsbehov(steg: StegType): {
  løsAvklaringsbehovError?: ApiException;
  løsAvklaringsbehovStatus: LøsBehovOgGåTilNesteStegStatus;
  løsAvklaringsbehovIsLoading: boolean;
  løsAvklaringsbehov: (avklaringsbehov: LøsAvklaringsbehovPåBehandling, callback?: () => void) => void;
  løsPeriodisertAvklaringsbehov: (avklaringsbehov: LøsningerForPerioder, callback?: () => void) => void;
} {
  const params = useParamsMedType();
  const router = useRouter();
  const { refetchFlytClient } = useFlyt();
  const { setIsModalOpen } = useIngenFlereOppgaverModal();

  const [status, setStatus] = useState<LøsBehovOgGåTilNesteStegStatus>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | undefined>();
  const [isPending, startTransition] = useTransition();

  const { sjekkTildeling } = useTildelingssjekk(params.behandlingsreferanse);

  const løsAvklaringsbehov = async (
    avklaringsbehov: LøsAvklaringsbehovPåBehandling | LøsPeriodisertBehovPåBehandling,
    erPeriodisert: boolean,
    callback?: () => void
  ) => {
    setIsLoading(true);
    setStatus(undefined);
    setError(undefined);

    /**
     * Det første vi må gjøre er å sjekke om saksbehandler fortsatt har behandlingen tildelt.
     * På den måten unngår vi å løse avklaringsbehov på en behandling som er tildelt en annen saksbehandler.
     */
    if (!isLocal()) {
      const erTildeltInnloggetBruker = await sjekkTildeling();
      if (!erTildeltInnloggetBruker) {
        setIsLoading(false);
        return;
      }
    }

    /**
     * Vi prøver deretter å løse avklaringebehovet.
     * Dersom vi får 409 Conflict fra backend ligger vi på feil behandlingsversjon og vi må hente
     * inn siste versjon og prøve på nytt.
     */
    const løsAvklaringsbehov = await løsAvklaringsbehovMedRetry(
      avklaringsbehov,
      erPeriodisert,
      params.behandlingsreferanse
    );
    if (isError(løsAvklaringsbehov)) {
      setError(løsAvklaringsbehov.apiException);
      setIsLoading(false);
      return;
    }

    /**
     * Når avklaringsbehovet er løst må vi lytte på endepunktet /nesteSteg i backend
     * for å få med oss svar fra motoren.
     */
    const eventData = await listenSSE(
      `/saksbehandling/api/behandling/hent/${params.behandlingsreferanse}/${params.aktivGruppe}/${steg}/nesteSteg/`,
      {
        onPolling: (status) => setStatus(status),
        onError: () => {
          setStatus('ERROR');
          setIsLoading(false);
          router.refresh();
        },
      }
    );

    if (!eventData) {
      return;
    }

    /**
     * Dersom saksbehandler ikke har flere oppgaver etter dette viser vi en modal
     * eller redirecter til neste steg.
     */
    const visIngenFlereOppgaverModal = await skalViseIngenFlereOppgaverModal(
      eventData,
      params.behandlingsreferanse,
      harUnderkjentVurdering(avklaringsbehov)
    );

    if (visIngenFlereOppgaverModal) {
      setIsModalOpen(true);
    } else if (eventData.skalBytteGruppe || eventData.skalBytteSteg) {
      router.push(
        `/saksbehandling/sak/${params.saksnummer}/${params.behandlingsreferanse}/${eventData.aktivVisningGruppe}/#${eventData.aktivtVisningSteg}`
      );
    }

    startTransition(() => {
      router.refresh();
      refetchFlytClient();
    });

    setIsLoading(false);

    if (callback) {
      callback();
    }
  };

  return {
    løsAvklaringsbehovIsLoading: isLoading || isPending,
    løsAvklaringsbehovStatus: status,
    løsAvklaringsbehov: (avklaringsbehov, callback) => løsAvklaringsbehov(avklaringsbehov, false, callback),
    løsPeriodisertAvklaringsbehov: (avklaringsbehov, callback) => løsAvklaringsbehov(avklaringsbehov, true, callback),
    løsAvklaringsbehovError: error,
  };
}
