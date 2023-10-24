import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykepengeerstatning/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Sykepengeerstatning = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt2(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises('SYKEPENGEERSTATNING', flyt);
  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'VURDER_SYKEPENGEERSTATNING') {
          return (
            <StegSuspense key={steg}>
              <SykepengeerstatningMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};
