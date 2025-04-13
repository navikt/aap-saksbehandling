import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StudentvurderingMedDataFetching } from 'components/behandlinger/sykdom/student/student/StudentvurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const Student = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('STUDENT', flyt.data);

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'AVKLAR_STUDENT') {
          return (
            <StegSuspense key={steg}>
              <StudentvurderingMedDataFetching
                behandlingsreferanse={behandlingsreferanse}
                readOnly={flyt.data.visning.saksbehandlerReadOnly}
                behandlingVersjon={flyt.data.behandlingVersjon}
              />
            </StegSuspense>
          );
        }
      })}
    </GruppeSteg>
  );
};
