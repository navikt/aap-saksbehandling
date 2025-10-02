import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import {
  hentBeregningstidspunktVurdering,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isProd } from 'lib/utils/environment';
import { FastsettBeregningNyVising } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningNyVisning';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentBeregningstidspunktVurdering(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, !!grunnlag.data.vurdering)) {
    return null;
  }

  return !isProd() ? (
    <FastsettBeregningNyVising
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <FastsettBeregning
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
