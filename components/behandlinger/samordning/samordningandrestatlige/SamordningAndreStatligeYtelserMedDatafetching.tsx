import { SamordningAndreStatligeYtelser } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelser';
import {
  hentMellomlagring,
  hentSamordningAndreStatligeYtelseGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isProd } from 'lib/utils/environment';
import { SamordningAndreStatligeYtelserNyVisning } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelserNyVisning';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}
export const SamordningAndreStatligeYtelserMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningAndreStatligeYtelseGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurdering != null)) {
    return null;
  }

  return !isProd() ? (
    <SamordningAndreStatligeYtelserNyVisning
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <SamordningAndreStatligeYtelser
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
