import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SkriveBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveBrevMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Brev = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivGruppe={"BREV"}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <SkriveBrevMedDataFetching
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          aktivtSteg={flyt.aktivtSteg}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
