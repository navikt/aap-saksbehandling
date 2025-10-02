import { YrkesskadeGrunnlagBeregning } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregning';
import {
  hentBeregningYrkesskadeVurdering,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isProd } from 'lib/utils/environment';
import { YrkesskadeGrunnlagBeregningNyVisning } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningNyVisning';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const YrkesskadeGrunnlagBeregningMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentBeregningYrkesskadeVurdering(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.FASTSETT_YRKESSKADEINNTEKT),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurderinger != null && grunnlag.data.vurderinger.length > 0)) {
    return null;
  }

  return !isProd() ? (
    <YrkesskadeGrunnlagBeregningNyVisning
      yrkeskadeBeregningGrunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <YrkesskadeGrunnlagBeregning
      yrkeskadeBeregningGrunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
