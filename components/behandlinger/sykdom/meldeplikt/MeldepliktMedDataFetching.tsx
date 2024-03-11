import { hentUnntakMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';

interface Props {
  behandlingsReferanse: string;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsReferanse);

  console.log('grunnlag', grunnlag);

  return <Meldeplikt behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
