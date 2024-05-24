import { hentUnntakMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsReferanse);

  return <Meldeplikt grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
