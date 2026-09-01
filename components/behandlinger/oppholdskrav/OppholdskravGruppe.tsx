import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { OppholdskravStegMedDataFatching } from 'components/behandlinger/oppholdskrav/OppholdskravStegMedDataFatching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { getStegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const OppholdskravStegGruppe = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegData = getStegData('OPPHOLDSKRAV', 'VURDER_OPPHOLDSKRAV', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <OppholdskravStegMedDataFatching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readOnly={stegData.readOnly}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
