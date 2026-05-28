import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { hentSvarFraAndreinstansGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { KabalIverksettKonsekvens } from 'components/behandlinger/klage/kabaliverksettkonsekvens/KabalIverksettKonsekvens';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

type Props = {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
};

export const KabalIverksettKonsekvensSteg = async ({ behandlingsreferanse, flyt }: Props) => {
  const grunnlag = await hentSvarFraAndreinstansGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <KabalIverksettKonsekvens grunnlag={grunnlag.data} />
    </GruppeSteg>
  );
};
