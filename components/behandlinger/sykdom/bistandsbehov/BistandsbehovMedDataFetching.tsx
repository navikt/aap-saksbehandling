import { hentBistandsbehovGrunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { isDev } from 'lib/utils/environment';
import { BistandsbehovNyVisning } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovNyVisning';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
  overgangUføreEnabled: Boolean;
  overgangArbeidEnabled: Boolean;
}

export const BistandsbehovMedDataFetching = async ({
  behandlingsReferanse,
  stegData,
  overgangArbeidEnabled,
  overgangUføreEnabled,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_BISTANDSBEHOV_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  
  const harTidligereVurderinger =
    grunnlag.data.gjeldendeVedtatteVurderinger != null && grunnlag.data.gjeldendeVedtatteVurderinger.length > 0;

  if (!skalViseSteg(stegData, harTidligereVurderinger)) {
    return null;
  }
  
  return isDev() ? (
    <BistandsbehovNyVisning
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={typeBehandling}
    />
  ) : (
    <Bistandsbehov
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={stegData.typeBehandling}
      overgangArbeidEnabled={overgangArbeidEnabled}
      overgangUføreEnabled={overgangUføreEnabled}
    />
  );
};
