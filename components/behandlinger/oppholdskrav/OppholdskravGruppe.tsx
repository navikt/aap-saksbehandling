import { BehandlingFlytOgTilstand } from 'lib/types/types';

import { OppholdskravStegMedDataFatching } from 'components/behandlinger/oppholdskrav/OppholdskravStegMedDataFatching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const OppholdskravStegGruppe = async ({ behandlingsreferanse, flyt }: Props) => {
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
          readOnly={flyt.visning.saksbehandlerReadOnly}
          visVentekort={flyt.visning.visVentekort}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
