import {
  hentBehandling,
  hentMellomlagring,
  hentVedtakslengdeGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { VedtakslengdeSteg } from 'components/behandlinger/vedtakslengde/VedtakslengdeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
}

export const VedtakslengdeMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  visVentekort,
}: Props) => {
  const [grunnlag, behandling] = await Promise.all([
    hentVedtakslengdeGrunnlag(behandlingsreferanse),
    hentBehandling(behandlingsreferanse),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_VEDTAKSLENGDE,
    totalReadOnly,
    visVentekort
  );

  const erVedtakslengdeManuelt =
    behandling.type === 'SUCCESS' &&
    behandling.data.vurderingsbehovOgÅrsaker.some(
      (behovOgÅrsak) =>
        behovOgÅrsak.årsak === 'UTVID_VEDTAKSLENGDE' &&
        behovOgÅrsak.vurderingsbehov.some((x) => x.type === 'VEDTAKSLENGDE_MANUELT')
    );

  return (
    <VedtakslengdeSteg
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      erVedtakslengdeManuelt={erVedtakslengdeManuelt}
    />
  );
};
