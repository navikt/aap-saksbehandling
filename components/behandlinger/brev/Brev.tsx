import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SkriveBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveBrevMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Brev = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  //const stegSomSkalVises = getStegSomSkalVises('BREV', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
    >
      {/*{stegSomSkalVises.includes('BREV') && (*/}
      <StegSuspense>
        <SkriveBrevMedDataFetching behandlingsReferanse={behandlingsReferanse} />
      </StegSuspense>
      {/*})}*/}
    </GruppeSteg>
  );
};
