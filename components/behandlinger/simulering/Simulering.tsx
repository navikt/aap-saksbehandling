import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { UtbetalingOgSimuleringMedDataFetching } from './utbetalingogsimulering/UtbetalingOgSimuleringMedDataFetching';
import { Alert } from '@navikt/ds-react';
import { toggles } from 'lib/utils/toggles';

interface Props {
  behandlingsreferanse: string;
}

export const Simulering = async ({ behandlingsreferanse }: Props) => {
  // TODO: Ref AAP-1325 - Skal skjule simuleringssteget frem til forbedringer er på plass
  if (!toggles.featureSimulering) {
    return <div>Simulering er foreløpig under arbeid</div>;
  }
  const [flyt, behandling] = await Promise.all([hentFlyt(behandlingsreferanse), hentBehandling(behandlingsreferanse)]);
  if (isError(flyt) || isError(behandling)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        {behandling.data.status === 'UTREDES' || behandling.data.status === 'OPPRETTET' ? (
          <UtbetalingOgSimuleringMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        ) : (
          <Alert variant={'info'}>
            Simulering kan kun vises etter steget Tilkjent ytelse, og før det er fattet et vedtak.
          </Alert>
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
