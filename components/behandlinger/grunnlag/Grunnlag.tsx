import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';

interface Props {
  behandlingsReferanse: string;
}
export const Grunnlag = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('GRUNNLAG', flyt);

  const erPåFatteVedtakSteg = flyt.aktivtSteg === 'FATTE_VEDTAK';

  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'FASTSETT_BEREGNINGSTIDSPUNKT') {
          return (
            <StegSuspense key={steg}>
              <FastsettBeregningMedDataFeching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={erPåFatteVedtakSteg}
              />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};
