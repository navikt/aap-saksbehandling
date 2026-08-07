import {
  hentMellomlagring,
  hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse,
  hentSamordningGraderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SamordningGraderingMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, oppfølgningOppgaver] = await Promise.all([
    hentSamordningGraderingGrunnlag(behandlingsreferanse),
    hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse(
      behandlingsreferanse,
      Behovstype.AVKLAR_SAMORDNING_GRADERING
    ),
  ]);

  if (isError(grunnlag) || isError(oppfølgningOppgaver)) {
    return <ApiException apiResponses={[grunnlag, oppfølgningOppgaver]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_SAMORDNING_GRADERING,
    totalReadOnly,
    stegData.visVentekort
  );

  return (
    <SamordningGradering
      oppfølgningOppgave={oppfølgningOppgaver.data}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
