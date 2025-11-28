import {
  hentFastsettArbeidsevneGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneGammel';
import { StegData } from 'lib/utils/steg';
import { toggles } from 'lib/utils/toggles';
import { FastsettArbeidsevnePeriodisertFrontend } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevnePeriodisertFrontend';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentFastsettArbeidsevneGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FASTSETT_ARBEIDSEVNE_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return toggles.featurePeriodiserteValgfrieKort ? (
    <FastsettArbeidsevnePeriodisertFrontend
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <FastsettArbeidsevne
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
