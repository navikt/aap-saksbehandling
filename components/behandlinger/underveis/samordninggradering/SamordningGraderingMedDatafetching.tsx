import { SamordningGradering } from 'components/behandlinger/underveis/samordninggradering/SamordningGradering';
import { hentSamordningGraderingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

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
  const grunnlag = await hentSamordningGraderingGrunnlag(behandlingsreferanse);
  if (grunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningGradering
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
