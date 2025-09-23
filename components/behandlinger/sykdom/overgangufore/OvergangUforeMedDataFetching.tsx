import { hentMellomlagring, hentOvergangUforeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { OvergangUfore } from 'components/behandlinger/sykdom/overgangufore/OvergangUfore';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isDev } from 'lib/utils/environment';
import { OvergangUforeNyVisning } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeNyVisning';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const OvergangUforeMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentOvergangUforeGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.OVERGANG_UFORE),
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
    <OvergangUforeNyVisning
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={stegData.typeBehandling}
    />
  ) : (
    <OvergangUfore
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={stegData.typeBehandling}
    />
  );
};
