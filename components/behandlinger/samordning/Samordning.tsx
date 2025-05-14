import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SamordningSosialhjelpMedDatafetching } from 'components/behandlinger/samordning/samordningsosial/SamordningSosialhjelpMedDatafetching';
import { SamordningAndreStatligeYtelserMedDatafetching } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelserMedDatafetching';
import { SamordningGraderingMedDatafetching } from 'components/behandlinger/samordning/samordninggradering/SamordningGraderingMedDatafetching';
import { SamordningUføreMedDatafetching } from 'components/behandlinger/samordning/samordninguføre/SamordningUføreMedDatafetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SamordningTjenestePensjonMedDataFetching } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjonMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Samordning = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('SAMORDNING', flyt.data);

  console.log('stegSomSkalVises', stegSomSkalVises);
  console.log('flyt', flyt);

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
      <SamordningTjenestePensjonMedDataFetching
        behandlingreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.data.behandlingVersjon}
        readOnly={flyt.data.visning.saksbehandlerReadOnly}
      />
    </GruppeSteg>
  );
};
