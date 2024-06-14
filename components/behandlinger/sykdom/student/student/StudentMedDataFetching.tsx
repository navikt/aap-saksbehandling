import { Student } from 'components/behandlinger/sykdom/student/student/Student';
import { hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const StudentMedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentStudentGrunnlag(behandlingsreferanse);

  return <Student grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
