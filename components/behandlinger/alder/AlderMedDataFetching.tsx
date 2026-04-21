import { hentAlderGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Alder } from 'components/behandlinger/alder/Alder';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const AlderMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentAlderGrunnlag(behandlingsreferanse);
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[grunnlag, flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <Alder grunnlag={grunnlag.data} />
    </GruppeSteg>
  );
};
