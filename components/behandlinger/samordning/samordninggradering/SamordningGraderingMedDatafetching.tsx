import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import {
  hentMellomlagring,
  hentSamordningGraderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SamordningGraderingMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, brukerInformasjon, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningGraderingGrunnlag(behandlingsreferanse),
    hentBrukerInformasjon(),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_GRADERING),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurdering != null)) {
    return null;
  }

  return (
    <SamordningGradering
      bruker={brukerInformasjon}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
