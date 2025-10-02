import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';
import {
  hentMellomlagring,
  hentSamordningTjenestePensjonGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isProd } from 'lib/utils/environment';
import { SamordningTjenestePensjonNyVisning } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjonNyVisning';

interface Props {
  behandlingreferanse: string;
  stegData: StegData;
}

export const SamordningTjenestePensjonMedDataFetching = async ({ behandlingreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningTjenestePensjonGrunnlag(behandlingreferanse),
    hentMellomlagring(behandlingreferanse, Behovstype.SAMORDNING_REFUSJONS_KRAV),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.tjenestepensjonRefusjonskravVurdering != null)) {
    return null;
  }

  return !isProd() ? (
    <SamordningTjenestePensjonNyVisning
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <SamordningTjenestePensjon
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
