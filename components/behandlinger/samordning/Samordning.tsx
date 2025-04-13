import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SamordningSosialhjelpMedDatafetching } from 'components/behandlinger/underveis/samordningsosial/SamordningSosialhjelpMedDatafetching';
import { SamordningAndreStatligeYtelserMedDatafetching } from 'components/behandlinger/underveis/samordningandrestatlige/SamordningAndreStatligeYtelserMedDatafetching';
import { SamordningGraderingMedDatafetching } from 'components/behandlinger/underveis/samordninggradering/SamordningGraderingMedDatafetching';
import { SamordningUføreMedDatafetching } from 'components/behandlinger/underveis/samordninguføre/SamordningUføreMedDatafetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const Samordning = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('SAMORDNING', flyt.data);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <SamordningSosialhjelpMedDatafetching behandlingsreferanse={behandlingsreferanse} />
      <SamordningGraderingMedDatafetching
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.data.behandlingVersjon}
        readOnly={flyt.data.visning.saksbehandlerReadOnly}
      />
      {stegSomSkalVises.includes('SAMORDNING_UFØRE') && (
        <SamordningUføreMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
        />
      )}
      <SamordningAndreStatligeYtelserMedDatafetching
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.data.behandlingVersjon}
        readOnly={flyt.data.visning.saksbehandlerReadOnly}
      />
    </GruppeSteg>
  );
};
