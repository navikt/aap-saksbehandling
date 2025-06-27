import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { TilkjentMedDatafetching } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TilkjentMedDatafetchingV2 } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDataFetchingV2';
import { isDev } from 'lib/utils/environment';

interface Props {
  behandlingsReferanse: string;
}
export const TilkjentYtelse = async ({ behandlingsReferanse }: Props) => {
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
        {isDev() && <TilkjentMedDatafetchingV2 behandlingsReferanse={behandlingsReferanse} />}
        <TilkjentMedDatafetching behandlingsReferanse={behandlingsReferanse} />
      </StegSuspense>
    </GruppeSteg>
  );
};
