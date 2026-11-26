import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VurderSøknadUtenlandsopphold } from 'components/behandlinger/utenlandsopphold/VurderSøknadUtenlandsopphold';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Utenlandsopphold = ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <VurderSøknadUtenlandsopphold
        behandlingVersjon={flyt.behandlingVersjon}
        readOnly={flyt.visning.saksbehandlerReadOnly}
      />
    </GruppeSteg>
  );
};
