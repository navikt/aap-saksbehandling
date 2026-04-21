import {
  hentBehandling,
  hentMellomlagring,
  hentVedtakslengdeGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VedtakslengdeSteg } from 'components/behandlinger/vedtakslengde/VedtakslengdeSteg';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const VedtakslengdeMedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const [grunnlag, initialMellomlagretVurdering, behandling] = await Promise.all([
    hentVedtakslengdeGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.FASTSETT_VEDTAKSLENGDE),
    hentBehandling(behandlingsreferanse),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

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
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      erVedtakslengdeManuelt={erVedtakslengdeManuelt}
    />
  );
};
