import { StudentMedDataFetching } from 'components/behandlinger/student/student/StudentMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getToken } from 'lib/auth/authentication';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { headers } from 'next/headers';

interface Props {
  behandlingsReferanse: string;
}

export const Student = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt2(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises('STUDENT', flyt);

  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'VURDER_STUDENT') {
          return (
            <StegSuspense key={steg}>
              <StudentMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};
