import { hentAlderGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Alder } from 'components/behandlinger/alder/Alder';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
}

export const AlderMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentAlderGrunnlag(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[grunnlag, flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <Alder grunnlag={grunnlag.data} />
    </GruppeSteg>
  );
};
