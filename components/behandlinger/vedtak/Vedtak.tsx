import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { BrevmalVelger } from 'components/brevmalvelger/BrevmalVelger';
import { hentAlleBrevmaler } from 'lib/services/sanityservice/sanityservice';
import { ForeslåVedtakMedDataFetching } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtakMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Vedtak = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const brevmaler = await hentAlleBrevmaler();

  const stegSomSkalVises = getStegSomSkalVises('VEDTAK', flyt);

  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'FORESLÅ_VEDTAK') {
          return (
            <StegSuspense key={steg}>
              <ForeslåVedtakMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}

      <BrevmalVelger brevmaler={brevmaler} />
    </>
  );
};
