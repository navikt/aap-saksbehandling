import { ForeslåVedtakMedDataFetching } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtakMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { FatteVedtakMedDataFetching } from 'components/behandlinger/vedtak/fattevedtak/FatteVedtakMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Vedtak = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

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

        if (steg === 'FATTE_VEDTAK') {
          return (
            <StegSuspense key={steg}>
              <FatteVedtakMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};
