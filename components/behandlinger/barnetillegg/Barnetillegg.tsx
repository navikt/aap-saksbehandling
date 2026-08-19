import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BarnetilleggVurderingMedDataFetching } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegData } from 'lib/utils/steg';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Barnetillegg = async ({ behandlingsreferanse, flyt }: Props) => {
  const barnetilleggSteg = getStegData('BARNETILLEGG', 'BARNETILLEGG', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <BarnetilleggVurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={barnetilleggSteg} />
      </StegSuspense>
    </GruppeSteg>
  );
};
