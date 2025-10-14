import {
  hentMellomlagring,
  hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse,
  hentSamordningGraderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SamordningGraderingMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, brukerInformasjon, oppfølgningOppgaver, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningGraderingGrunnlag(behandlingsreferanse),
    hentBrukerInformasjon(),
    hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse(
      behandlingsreferanse,
      Behovstype.AVKLAR_SAMORDNING_GRADERING
    ),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_GRADERING),
  ]);

  if (isError(grunnlag) || isError(oppfølgningOppgaver)) {
    return <ApiException apiResponses={[grunnlag, oppfølgningOppgaver]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurdering != null)) {
    return null;
  }

  return (
    <SamordningGradering
      oppfølgningOppgave={oppfølgningOppgaver.data}
      bruker={brukerInformasjon}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
