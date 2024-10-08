import { hentUnntakMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { MeldepliktV2 } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktV2';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsReferanse);

  return <MeldepliktV2 grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
