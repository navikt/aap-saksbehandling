import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import {
  hentMellomlagring,
  hentSamordningGraderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SamordningGraderingMedDatafetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningGraderingGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_GRADERING),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  const brukerInformasjon = await hentBrukerInformasjon();
  /**
  const oppfølgningOppgaver = await hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse(
    behandlingsreferanse,
    Behovstype.AVKLAR_SAMORDNING_GRADERING
  );
    **/

  <SamordningGradering
    //oppfølgningOppgave={oppfølgningOppgaver}
    bruker={brukerInformasjon}
    grunnlag={grunnlag.data}
    behandlingVersjon={behandlingVersjon}
    readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    initialMellomlagretVurdering={initialMellomlagretVurdering}
  />;
};
