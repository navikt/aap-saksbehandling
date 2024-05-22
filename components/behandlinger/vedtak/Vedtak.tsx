import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { BrevmalVelger } from 'components/brevmalvelger/BrevmalVelger';
import { hentAlleBrevmaler } from 'lib/services/sanityservice/sanityservice';
import { ForeslåVedtakMedDataFetching } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtakMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { SideProsesser } from 'components/sideprosesser/SideProsesser';

interface Props {
  behandlingsReferanse: string;
}

export const Vedtak = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const brevmaler = await hentAlleBrevmaler();

  const stegSomSkalVises = getStegSomSkalVises('VEDTAK', flyt);

  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <>
      {flyt.prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={flyt.prosessering} />}
      <SideProsesser
        visVenteKort={flyt.visning.visVentekort}
        behandlingReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingVersjon}
      />
      {stegSomSkalVises.map((steg) => {
        if (steg === 'FORESLÅ_VEDTAK') {
          return (
            <StegSuspense key={steg}>
              <ForeslåVedtakMedDataFetching
                behandlingsReferanse={behandlingsReferanse}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
      })}

      <BrevmalVelger brevmaler={brevmaler} />
    </>
  );
};
