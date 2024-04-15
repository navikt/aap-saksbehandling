import { hentUnntakMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse, readOnly }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsReferanse);

  return <Meldeplikt behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} readOnly={readOnly} />;
};
