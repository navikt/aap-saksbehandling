import {
  hentBehandling,
  hentBistandsbehovGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const BistandsbehovMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering, behandling] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_BISTANDSBEHOV_KODE),
    hentBehandling(behandlingsreferanse),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const harTidligereVurderinger =
    grunnlag.data.sisteVedtatteVurderinger != null && grunnlag.data.sisteVedtatteVurderinger.length > 0;

  if (!skalViseSteg(stegData, harTidligereVurderinger)) {
    return null;
  }

  const vurderingsbehov =
    behandling.type === 'SUCCESS'
      ? behandling.data.vurderingsbehovOgÅrsaker.flatMap((behovOgÅrsak) => behovOgÅrsak.vurderingsbehov)
      : [];
  const erRevurderingAvOvergangUføre = vurderingsbehov.some((behov) => behov.type === 'OVERGANG_UFORE');

  return (
    <Bistandsbehov
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      erRevurderingAvOvergangUføre={erRevurderingAvOvergangUføre}
    />
  );
};
