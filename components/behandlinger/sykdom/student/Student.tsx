import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StudentvurderingMedDataFetching } from 'components/behandlinger/sykdom/student/student/StudentvurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegData } from 'lib/utils/steg';
import { SykestipendMedDataFetching } from 'components/behandlinger/sykdom/student/sykestipend/SykestipendMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Student = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const avklarStudentSteg = getStegData('STUDENT', 'AVKLAR_STUDENT', flyt.data);
  const sykestipendSteg = getStegData('STUDENT', 'SAMORDNING_SYKESTIPEND', flyt.data);

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {avklarStudentSteg.skalViseSteg && (
        <StegSuspense>
          <StudentvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={avklarStudentSteg} />
        </StegSuspense>
      )}
      {sykestipendSteg.skalViseSteg && (
        <StegSuspense>
          <SykestipendMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={avklarStudentSteg} />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
