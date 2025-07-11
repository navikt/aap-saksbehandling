import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { hentFlyt, hentSvarFraAndreinstansGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { KabalIverksettKonsekvens } from 'components/behandlinger/klage/kabaliverksettkonsekvens/KabalIIverksettKonsekvens';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';

type Props = {
  behandlingsreferanse: string;
};

export const KabalIverksettKonsekvensSteg = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentSvarFraAndreinstansGrunnlag(behandlingsreferanse);
  const flyt = await hentFlyt(behandlingsreferanse);

  if (isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[grunnlag, flyt]} />;
  }

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <KabalIverksettKonsekvens grunnlag={grunnlag.data} />
    </GruppeSteg>
  );
};
