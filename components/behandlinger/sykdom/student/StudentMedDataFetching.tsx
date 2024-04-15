import { Student } from 'components/behandlinger/sykdom/student/Student';
import { hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const StudentMedDataFetching = async ({ behandlingsReferanse, readOnly }: Props) => {
  const grunnlag = await hentStudentGrunnlag(behandlingsReferanse);

  return <Student behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} readOnly={readOnly} />;
};
