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

  console.log('stegSomSkalVises', stegSomSkalVises);

  return (
    <StegSuspense>
      <GruppeSteg
        prosessering={flyt.prosessering}
        visVenteKort={flyt.visning.visVentekort}
        behandlingReferanse={behandlingsreferanse}
        behandlingVersjon={flyt.behandlingVersjon}
      >
        <BarnMedDataFetching behandlingsreferanse={behandlingsreferanse} />
      </GruppeSteg>
    </StegSuspense>
  );
};
