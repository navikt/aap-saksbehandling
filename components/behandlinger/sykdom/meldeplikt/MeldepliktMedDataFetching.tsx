import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { hentUnntakMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsReferanse);

  return (
    <Meldeplikt
      grunnlag={grunnlag}
      readOnly={readOnly && !grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
