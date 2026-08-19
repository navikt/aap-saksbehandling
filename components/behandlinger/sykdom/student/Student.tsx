import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StudentvurderingMedDataFetching } from 'components/behandlinger/sykdom/student/studentvurdering/StudentvurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegData } from 'lib/utils/steg';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Student = async ({ behandlingsreferanse, flyt }: Props) => {
  const avklarStudentSteg = getStegData('STUDENT', 'AVKLAR_STUDENT', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {avklarStudentSteg.skalViseSteg && (
        <StegSuspense>
          <StudentvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={avklarStudentSteg} />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
