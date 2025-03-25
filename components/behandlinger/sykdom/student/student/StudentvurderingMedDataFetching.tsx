import { Studentvurdering } from 'components/behandlinger/sykdom/student/student/Studentvurdering';
import { hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const StudentvurderingMedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentStudentGrunnlag(behandlingsreferanse);

  return (
    <Studentvurdering
      grunnlag={grunnlag}
      readOnly={readOnly && grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
