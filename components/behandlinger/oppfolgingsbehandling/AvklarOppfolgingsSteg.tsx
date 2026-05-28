import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { AvklarOppfolgingVurderingMedDataFetching } from './AvklarOppfolgingVurderingMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

type Props = {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
};

export const AvklarOppfolgingsSteg = async ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <AvklarOppfolgingVurderingMedDataFetching
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.behandlingVersjon}
        readOnly={flyt.visning.saksbehandlerReadOnly}
      />
    </GruppeSteg>
  );
};
