import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import {
  hentMellomlagring,
  hentUnntakMeldepliktGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { isDev } from 'lib/utils/environment';
import { MeldepliktNyVisning } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktNyVisning';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentUnntakMeldepliktGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FRITAK_MELDEPLIKT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return isDev() ? (
    <MeldepliktNyVisning
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Meldeplikt
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
