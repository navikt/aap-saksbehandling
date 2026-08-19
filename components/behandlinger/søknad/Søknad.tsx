import { TrekkSøknadMedDatafetching } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknadMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Søknad = async ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <TrekkSøknadMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          readOnly={flyt.visning.saksbehandlerReadOnly}
          behandlingVersjon={flyt.behandlingVersjon}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
