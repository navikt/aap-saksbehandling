import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { FatteVedtakMedDataFetching } from 'components/behandlinger/fattevedtak/fattevedtak/FatteVedtakMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';

interface Props {
  behandlingsReferanse: string;
}

export const FatteVedtak = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('FATTE_VEDTAK', flyt);

  return (
    <>
      {flyt.prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={flyt.prosessering} />}
      {stegSomSkalVises.map((steg) => {
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
