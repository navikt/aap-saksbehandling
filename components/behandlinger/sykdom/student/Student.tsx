import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StudentvurderingMedDataFetching } from 'components/behandlinger/sykdom/student/student/StudentvurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegSomSkalVises } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
}

export const Student = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const harAvklaringsbehov = getStegSomSkalVises('STUDENT', flyt.data).includes('AVKLAR_STUDENT');
  const erRevurdering = flyt.data.visning.typeBehandling === 'Revurdering';

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {(harAvklaringsbehov || erRevurdering) && (
        <StegSuspense>
          <StudentvurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly || !harAvklaringsbehov}
            harAvklaringsbehov={harAvklaringsbehov}
            erRevurdering={erRevurdering}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
