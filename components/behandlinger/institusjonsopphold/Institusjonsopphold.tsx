import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonMedDataFetching } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/HelseinstitusjonMedDataFetching';
import { SoningsvurderingMedDataFetching } from './soning/SoningsvurderingMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { getStegData } from 'lib/utils/steg';
import { ManglendeOpphold } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/ManglendeOpphold';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Institusjonsopphold = async ({ behandlingsreferanse, flyt }: Props) => {
  const vurderHelseinstitusjonSteg = getStegData(
    'ET_ANNET_STED',
    'DU_ER_ET_ANNET_STED',
    flyt,
    Behovstype.AVKLAR_HELSEINSTITUSJON
  );

  const vurderSoningSteg = getStegData(
    'ET_ANNET_STED',
    'DU_ER_ET_ANNET_STED',
    flyt,
    Behovstype.AVKLAR_SONINGSFORRHOLD
  );
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {vurderHelseinstitusjonSteg.skalViseSteg && (
        <StegSuspense>
          <HelseinstitusjonMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={vurderHelseinstitusjonSteg}
          />
        </StegSuspense>
      )}
      {vurderSoningSteg.skalViseSteg && (
        <StegSuspense>
          <SoningsvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderSoningSteg} />
        </StegSuspense>
      )}
      {!vurderHelseinstitusjonSteg.skalViseSteg && !vurderSoningSteg.skalViseSteg && (
        <StegSuspense>
          <ManglendeOpphold />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
