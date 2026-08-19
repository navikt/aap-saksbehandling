import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VurderRettighetsperiodeMedDataFetching } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiodeMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegData } from 'lib/utils/steg';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Rettighetsperiode = async ({ behandlingsreferanse, flyt }: Props) => {
  const rettighetsperiodeSteg = getStegData('RETTIGHETSPERIODE', 'VURDER_RETTIGHETSPERIODE', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      {rettighetsperiodeSteg.skalViseSteg && (
        <StegSuspense>
          <VurderRettighetsperiodeMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={rettighetsperiodeSteg}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
