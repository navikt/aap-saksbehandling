import {
  hentMellomlagring,
  hentSamordningAndreStatligeYtelseGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { SamordningAndreStatligeYtelser } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelser';

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

  return (
    <SamordningAndreStatligeYtelser
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
