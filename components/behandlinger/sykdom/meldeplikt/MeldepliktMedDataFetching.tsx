import {
  hentMellomlagring,
  hentUnntakMeldepliktGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { MeldepliktPeriodisertFrontend } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktPeriodisertFrontend';
import { StegData } from 'lib/utils/steg';
import { toggles } from 'lib/utils/toggles';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktGammel';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentUnntakMeldepliktGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FRITAK_MELDEPLIKT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return toggles.featurePeriodiserteValgfrieKort ? (
    <MeldepliktPeriodisertFrontend
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Meldeplikt
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
