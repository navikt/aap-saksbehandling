import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StudentvurderingMedDataFetching } from 'components/behandlinger/sykdom/student/student/StudentvurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

interface Props {
  behandlingsreferanse: string;
}

export const Student = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);

  const stegSomSkalVises = getStegSomSkalVises('STUDENT', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'AVKLAR_STUDENT') {
          return (
            <StegSuspense key={steg}>
              <StudentvurderingMedDataFetching
                behandlingsreferanse={behandlingsreferanse}
                readOnly={flyt.visning.saksbehandlerReadOnly}
                behandlingVersjon={flyt.behandlingVersjon}
              />
            </StegSuspense>
          );
        }
      })}
    </GruppeSteg>
  );
};
