import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { UtenlandsoppholdMedDataFetching } from 'components/behandlinger/utenlandsopphold/UtenlandsoppholdMedDataFetching';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Utenlandsopphold = async ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <UtenlandsoppholdMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}
          erIkkePåVent={!flyt.visning.visVentekort}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
