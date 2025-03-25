import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SamordningSosialhjelpMedDatafetching } from 'components/behandlinger/underveis/samordningsosial/SamordningSosialhjelpMedDatafetching';
import { SamordningAndreStatligeYtelserMedDatafetching } from 'components/behandlinger/underveis/samordningandrestatlige/SamordningAndreStatligeYtelserMedDatafetching';
import { SamordningGraderingMedDatafetching } from 'components/behandlinger/underveis/samordninggradering/SamordningGraderingMedDatafetching';
import { SamordningUføreMedDatafetching } from 'components/behandlinger/underveis/samordninguføre/SamordningUføreMedDatafetching';

interface Props {
  behandlingsreferanse: string;
}

export const Samordning = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('SAMORDNING', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
    >
      <SamordningSosialhjelpMedDatafetching behandlingsreferanse={behandlingsreferanse} />
      <SamordningAndreStatligeYtelserMedDatafetching
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.behandlingVersjon}
        readOnly={flyt.visning.saksbehandlerReadOnly}
      />
      <SamordningGraderingMedDatafetching
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.behandlingVersjon}
        readOnly={flyt.visning.saksbehandlerReadOnly}
      />
      {stegSomSkalVises.includes('SAMORDNING_UFØRE') && (
        <SamordningUføreMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}
        />
      )}
    </GruppeSteg>
  );
};
