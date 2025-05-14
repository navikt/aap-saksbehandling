import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { UtbetalingOgSimuleringMedDataFetching } from './utbetalingogsimulering/UtbetalingOgSimuleringMedDataFetching';
import { isProd } from 'lib/utils/environment';
import { Alert } from '@navikt/ds-react';

interface Props {
  behandlingsReferanse: string;
}

export const Simulering = async ({ behandlingsReferanse }: Props) => {
  // TODO Ikke aktivt i prod enda
  if (isProd()) {
    return <div>Simulering</div>;
  }
  const [flyt, behandling] = await Promise.all([hentFlyt(behandlingsReferanse), hentBehandling(behandlingsReferanse)]);
  if (isError(flyt) || isError(behandling)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        {behandling.data.status === 'UTREDES' || behandling.data.status === 'OPPRETTET' ? (
          <UtbetalingOgSimuleringMedDataFetching behandlingsreferanse={behandlingsReferanse} />
        ) : (
          <Alert variant={'info'}>
            Simulering kan kun vises etter steget Tilkjent ytelse, og før det er fattet et vedtak.
          </Alert>
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
