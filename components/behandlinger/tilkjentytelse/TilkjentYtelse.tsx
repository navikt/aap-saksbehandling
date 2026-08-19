import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { TilkjentMedDataFetching } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}
export const TilkjentYtelse = async ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <TilkjentMedDataFetching behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>
    </GruppeSteg>
  );
};
