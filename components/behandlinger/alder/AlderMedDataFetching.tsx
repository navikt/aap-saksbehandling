import { hentAlderGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Alder } from 'components/behandlinger/alder/Alder';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const AlderMedDataFetching = async ({ behandlingsreferanse, flyt }: Props) => {
  const grunnlag = await hentAlderGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <Alder grunnlag={grunnlag.data} />
    </GruppeSteg>
  );
};
