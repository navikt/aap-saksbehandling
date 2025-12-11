import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData } from 'lib/utils/steg';
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
import { SamordningBarnepensjonMedDatafetching } from 'components/behandlinger/samordning/samordningBarnepensjon/SamordningBarnepensjonMedDatafetching';

interface Props {
  behandlingsreferanse: string;
}

export const Samordning = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const aktivGruppe = 'SAMORDNING';
  const samordningSosialStønadSteg = getStegData('SYKDOM', 'REFUSJON_KRAV', flyt.data);
  const samordningGraderingSteg = getStegData(aktivGruppe, 'SAMORDNING_GRADERING', flyt.data);
  const samordningUføreSteg = getStegData(aktivGruppe, 'SAMORDNING_UFØRE', flyt.data);
  const samordningStatligeYtelserSteg = getStegData(aktivGruppe, 'SAMORDNING_ANDRE_STATLIGE_YTELSER', flyt.data);
  const samordningArbeidsgiverSteg = getStegData(aktivGruppe, 'SAMORDNING_ARBEIDSGIVER', flyt.data);
  const samordningTjenestepensjonSteg = getStegData(aktivGruppe, 'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV', flyt.data);
  const samordningBarnepensjonSteg = getStegData(aktivGruppe, 'SAMORDNING_BARNEPENSJON', flyt.data);

  console.log(samordningBarnepensjonSteg);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {samordningBarnepensjonSteg.skalViseSteg && (
        <StegSuspense>
          <SamordningBarnepensjonMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={samordningBarnepensjonSteg}
          />
        </StegSuspense>
      )}
      {samordningSosialStønadSteg.skalViseSteg && (
        <StegSuspense>
          <SamordningSosialstønadMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={samordningSosialStønadSteg}
          />
        </StegSuspense>
      )}

      <StegSuspense>
        <SamordningGraderingMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={samordningGraderingSteg}
        />
      </StegSuspense>

      <StegSuspense>
        <SamordningUføreMedDatafetching behandlingsreferanse={behandlingsreferanse} stegData={samordningUføreSteg} />
      </StegSuspense>

      <StegSuspense>
        <SamordningArbeidsgiverMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={samordningArbeidsgiverSteg}
        />
      </StegSuspense>

      {samordningTjenestepensjonSteg.skalViseSteg && (
        <StegSuspense>
          <SamordningTjenestePensjonMedDataFetching
            behandlingreferanse={behandlingsreferanse}
            stegData={samordningTjenestepensjonSteg}
          />
        </StegSuspense>
      )}

      <StegSuspense>
        <SamordningAndreStatligeYtelserMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={samordningStatligeYtelserSteg}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
