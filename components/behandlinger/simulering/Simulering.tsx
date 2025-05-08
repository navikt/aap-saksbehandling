import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { UtbetalingOgSimuleringMedDataFetching } from './utbetalingogsimulering/UtbetalingOgSimuleringMedDataFetching';
import { isProd } from 'lib/utils/environment';

interface Props {
  behandlingsReferanse: string;
}

export const Simulering = async ({ behandlingsReferanse }: Props) => {
  // TODO Ikke aktivt i prod enda
  if (isProd()) {
    return <div>Simulering</div>;
  }

  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
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
        <UtbetalingOgSimuleringMedDataFetching behandlingsreferanse={behandlingsReferanse} />
      </StegSuspense>
    </GruppeSteg>
  );
};
