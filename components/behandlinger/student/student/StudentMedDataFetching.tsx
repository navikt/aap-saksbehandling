import { Student } from 'components/behandlinger/student/student/Student';
import { getToken } from 'lib/auth/authentication';
import { hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

interface Props {
  behandlingsReferanse: string;
}

export const StudentMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentStudentGrunnlag(behandlingsReferanse, getToken(headers()));

  return <Student behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
