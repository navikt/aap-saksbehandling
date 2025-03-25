import { SamordningGradering } from 'components/behandlinger/underveis/samordninggradering/SamordningGradering';
import { hentSamordningGraderingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

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
  return (
    <SamordningGradering
      grunnlag={grunnlag}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly && !grunnlag.harTilgangTilÅSaksbehandle}
    />
  );
};
