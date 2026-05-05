import {
  hentBeregningYrkesskadeVurdering,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { YrkesskadeGrunnlagBeregning } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregning';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const YrkesskadeGrunnlagBeregningMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentBeregningYrkesskadeVurdering(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurderinger != null && grunnlag.data.vurderinger.length > 0)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_YRKESSKADEINNTEKT,
    totalReadOnly
  );

  return (
    <YrkesskadeGrunnlagBeregning
      yrkeskadeBeregningGrunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
