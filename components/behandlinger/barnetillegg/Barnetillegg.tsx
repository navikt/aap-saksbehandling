import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BarnMedDataFetching } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnMedDataFetching';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

interface Props {
  behandlingsreferanse: string;
}

export const Barnetillegg = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('BARNETILLEGG', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'BARNETILLEGG') {
          return (
            <StegSuspense key={steg}>
              <BarnMedDataFetching behandlingsreferanse={behandlingsreferanse} />
            </StegSuspense>
          );
        }
      })}
    </GruppeSteg>
  );
};
