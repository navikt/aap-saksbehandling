import { hentMellomlagring, hentOvergangUforeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { OvergangUfore } from 'components/behandlinger/sykdom/overgangufore/OvergangUfore';
import { toggles } from 'lib/utils/toggles';
import { OvergangUforePeriodisert } from 'components/behandlinger/sykdom/overgangufore/OvergangUforePeriodisert';

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

  return toggles.featurePeriodisertOvergangUføre ? (
    <OvergangUforePeriodisert
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
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
