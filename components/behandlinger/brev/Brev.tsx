import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SkriveBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveBrevMedDataFetching';
import { SkriveKlageBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveKlageBrevMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Brev = async ({ behandlingsreferanse, flyt }: Props) => {
  const typeBehandling = flyt.visning.typeBehandling;

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        {typeBehandling === 'Klage' ? (
          <SkriveKlageBrevMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.behandlingVersjon}
            aktivtSteg={flyt.aktivtSteg}
            behandlingstype={typeBehandling}
          />
        ) : (
          <SkriveBrevMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.behandlingVersjon}
            behandlingstype={typeBehandling}
            aktivtSteg={flyt.aktivtSteg}
          />
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
