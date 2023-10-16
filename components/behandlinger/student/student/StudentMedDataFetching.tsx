import { Student } from 'components/behandlinger/student/student/Student';

interface Props {
  behandlingsReferanse: string;
}

export const StudentMedDataFetching = ({ behandlingsReferanse }: Props) => {
  const grunnlag = {};

  return <Student behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
