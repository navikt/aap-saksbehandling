import { getStegData } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SamordningSosialstønadMedDatafetching } from 'components/behandlinger/samordning/samordningsosial/SamordningSosialstønadMedDatafetching';
import { SamordningAndreStatligeYtelserMedDatafetching } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelserMedDatafetching';
import { SamordningGraderingMedDatafetching } from 'components/behandlinger/samordning/samordninggradering/SamordningGraderingMedDatafetching';
import { SamordningUføreMedDatafetching } from 'components/behandlinger/samordning/samordninguføre/SamordningUføreMedDatafetching';
import { SamordningTjenestePensjonMedDataFetching } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjonMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SamordningArbeidsgiverMedDatafetching } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiverMedDatafetching';
import { SykestipendMedDataFetching } from 'components/behandlinger/samordning/sykestipend/SykestipendMedDataFetching';
import { BarnepensjonMedDataFetching } from 'components/behandlinger/samordning/barnepensjon/BarnepensjonMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Samordning = async ({ behandlingsreferanse, flyt }: Props) => {
  const aktivGruppe = 'SAMORDNING';
  const samordningSosialStønadSteg = getStegData('SYKDOM', 'REFUSJON_KRAV', flyt);
  const samordningGraderingSteg = getStegData(aktivGruppe, 'SAMORDNING_GRADERING', flyt);
  const samordningUføreSteg = getStegData(aktivGruppe, 'SAMORDNING_UFØRE', flyt);
  const samordningStatligeYtelserSteg = getStegData(aktivGruppe, 'SAMORDNING_ANDRE_STATLIGE_YTELSER', flyt);
  const samordningArbeidsgiverSteg = getStegData(aktivGruppe, 'SAMORDNING_ARBEIDSGIVER', flyt);
  const samordningTjenestepensjonSteg = getStegData(aktivGruppe, 'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV', flyt);
  const sykestipendSteg = getStegData(aktivGruppe, 'SAMORDNING_SYKESTIPEND', flyt);
  const samordningBarnepensjonSteg = getStegData(aktivGruppe, 'SAMORDNING_BARNEPENSJON', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
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

      {sykestipendSteg.skalViseSteg && (
        <StegSuspense>
          <SykestipendMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={sykestipendSteg} />
        </StegSuspense>
      )}

      {samordningBarnepensjonSteg.skalViseSteg && (
        <StegSuspense>
          <BarnepensjonMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={samordningBarnepensjonSteg}
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
