import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';
interface Props {
  behandlingsReferanse: string;
}
export const Grunnlag = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises('GRUNNLAG', flyt);
  console.log('stegSomSkalvists', stegSomSkalVises);
  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'FASTSETT_BEREGNINGSTIDSPUNKT') {
          return (
            <StegSuspense key={steg}>
              <FastsettBeregningMedDataFeching />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};
