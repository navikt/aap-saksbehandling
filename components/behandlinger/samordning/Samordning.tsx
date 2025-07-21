import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SamordningSosialstønadMedDatafetching } from 'components/behandlinger/samordning/samordningsosial/SamordningSosialstønadMedDatafetching';
import { SamordningAndreStatligeYtelserMedDatafetching } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelserMedDatafetching';
import { SamordningGraderingMedDatafetching } from 'components/behandlinger/samordning/samordninggradering/SamordningGraderingMedDatafetching';
import { SamordningUføreMedDatafetching } from 'components/behandlinger/samordning/samordninguføre/SamordningUføreMedDatafetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SamordningTjenestePensjonMedDataFetching } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjonMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SamordningArbeidsgiverMedDatafetching } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiverMedDatafetching';
import { isDev } from 'lib/utils/environment';

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
      <StegSuspense>
        <SamordningSosialstønadMedDatafetching behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>

      <StegSuspense>
        <SamordningGraderingMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>

      {stegSomSkalVises.includes('SAMORDNING_UFØRE') && (
        <StegSuspense>
          <SamordningUføreMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}

      <StegSuspense>
        <SamordningAndreStatligeYtelserMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>

      {isDev() && (
        <StegSuspense>
          <SamordningArbeidsgiverMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}

      {stegSomSkalVises.includes('SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV') && (
        <StegSuspense>
          <SamordningTjenestePensjonMedDataFetching
            behandlingreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
