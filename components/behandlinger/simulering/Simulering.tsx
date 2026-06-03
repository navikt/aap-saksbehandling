import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { UtbetalingOgSimuleringMedDataFetching } from './utbetalingogsimulering/UtbetalingOgSimuleringMedDataFetching';
import { toggles } from 'lib/utils/toggles';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Simulering = async ({ behandlingsreferanse, flyt }: Props) => {
  // TODO: Ref AAP-1325 - Skal skjule simuleringssteget frem til forbedringer er på plass
  if (!toggles.featureSimulering) {
    return <div>Simulering er foreløpig under arbeid</div>;
  }
  const behandling = await hentBehandling(behandlingsreferanse);
  if (isError(behandling)) {
    return <ApiException apiResponses={[behandling]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        {behandling.data.status === 'UTREDES' || behandling.data.status === 'OPPRETTET' ? (
          <UtbetalingOgSimuleringMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        ) : (
          <KelvinAlert variant={'info'}>
            Simulering kan kun vises etter steget Tilkjent ytelse, og før det er fattet et vedtak.
          </KelvinAlert>
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
