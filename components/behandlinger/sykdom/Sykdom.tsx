import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { getAvklaringsbehovForSteg, getStegData } from 'lib/utils/steg';
import { BistandsbehovMedDataFetching } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';
import { FastsettArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { RefusjonMedDataFetching } from 'components/behandlinger/sykdom/refusjon/RefusjonMedDataFetching';
import { SykdomsvurderingBrevMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrevMedDataFetching';
import { OvergangUforeMedDataFetching } from './overgangufore/OvergangUforeMedDataFetching';
import { OvergangArbeidMedDataFetching } from './overgangarbeid/OvergangArbeidMedDataFetching';
import { ArbeidsopptrappingMedDataFetching } from 'components/behandlinger/sykdom/arbeidsopptrapping/ArbeidsopptrappingMedDataFetching';
import { EtableringAvEgenVirksomhetMedDatafetching } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetMedDatafetching';
import { Behovstype } from 'lib/utils/form';
import { BehandlingFlytOgTilstand, StegGruppe } from 'lib/types/types';
import { BekreftVurderingerOppfølgingMedDataFetching } from 'components/behandlinger/sykdom/bekreftvurderingeroppfølging/BekreftVurderingerOppfølgingMedDataFetching';
import { StudentvurderingMedDataFetching } from 'components/behandlinger/sykdom/student/studentvurdering/StudentvurderingMedDataFetching';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Sykdom = async ({ behandlingsreferanse, flyt }: Props) => {
  const aktivStegGruppe = 'SYKDOM';
  const sykdomSteg = getStegData(aktivStegGruppe, 'AVKLAR_SYKDOM', flyt);
  const vurderBistandsbehovSteg = getStegData(aktivStegGruppe, 'VURDER_BISTANDSBEHOV', flyt);
  const arbeidsopptrappingSteg = getStegData(aktivStegGruppe, 'ARBEIDSOPPTRAPPING', flyt);
  const fritakMeldepliktSteg = getStegData(aktivStegGruppe, 'FRITAK_MELDEPLIKT', flyt);
  const etableringAvEgenVirksomhetSteg = getStegData(aktivStegGruppe, 'ETABLERING_EGEN_VIRKSOMHET', flyt);
  const fastsettArbeidsevneSteg = getStegData(aktivStegGruppe, 'FASTSETT_ARBEIDSEVNE', flyt);
  const refusjonskravSteg = getStegData(aktivStegGruppe, 'REFUSJON_KRAV', flyt);
  const sykdomsvurderingBrevSteg = getStegData(aktivStegGruppe, 'SYKDOMSVURDERING_BREV', flyt);
  const bekreftVurderingerOppfølgingSteg = getStegDataForBekreftVurderingerOppfølgingSteg(aktivStegGruppe, flyt);
  const vurderYrkesskadeSteg = getStegData(aktivStegGruppe, 'VURDER_YRKESSKADE', flyt);
  const vurderStudentStegV2 = getStegData(aktivStegGruppe, 'AVKLAR_STUDENT_V2', flyt);
  const vurderSykepengeerstatningSteg = getStegData(aktivStegGruppe, 'VURDER_SYKEPENGEERSTATNING', flyt);
  const overganguføreSteg = getStegData(aktivStegGruppe, 'OVERGANG_UFORE', flyt);
  const overgangarbeidSteg = getStegData(aktivStegGruppe, 'OVERGANG_ARBEID', flyt);

  const skalViseAlleSykdomSteg = unleashService.isEnabled('SkalViseAlleSykdomssteg');

  return (
    <GruppeSteg
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <SykdomsvurderingMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={sykdomSteg}
          skalViseAlleSykdomsSteg={skalViseAlleSykdomSteg}
        />
      </StegSuspense>
      <StegSuspense>
        <BistandsbehovMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderBistandsbehovSteg} />
      </StegSuspense>
      <StegSuspense>
        <MeldepliktMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={fritakMeldepliktSteg} />
      </StegSuspense>
      <StegSuspense>
        <EtableringAvEgenVirksomhetMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={etableringAvEgenVirksomhetSteg}
        />
      </StegSuspense>
      <StegSuspense>
        <FastsettArbeidsevneMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={fastsettArbeidsevneSteg}
        />
      </StegSuspense>
      <StegSuspense>
        <ArbeidsopptrappingMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={arbeidsopptrappingSteg}
        />
      </StegSuspense>

      <StegSuspense>
        <OvergangUforeMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={overganguføreSteg} />
      </StegSuspense>

      <StegSuspense>
        <OvergangArbeidMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={overgangarbeidSteg} />
      </StegSuspense>

      <StegSuspense>
        <RefusjonMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={refusjonskravSteg} />
      </StegSuspense>
      <StegSuspense>
        <SykdomsvurderingBrevMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={sykdomsvurderingBrevSteg}
        />
      </StegSuspense>
      {bekreftVurderingerOppfølgingSteg.skalViseSteg && !bekreftVurderingerOppfølgingSteg.readOnly && (
        <StegSuspense>
          <BekreftVurderingerOppfølgingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={bekreftVurderingerOppfølgingSteg.behandlingVersjon}
            readOnly={bekreftVurderingerOppfølgingSteg.readOnly}
          />
        </StegSuspense>
      )}
      <StegSuspense>
        <YrkesskadeMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderYrkesskadeSteg} />
      </StegSuspense>
      <StegSuspense>
        <StudentvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderStudentStegV2} />
      </StegSuspense>
      <StegSuspense>
        <SykepengeerstatningMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={vurderSykepengeerstatningSteg}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};

export function getStegDataForBekreftVurderingerOppfølgingSteg(
  aktivStegGruppe: StegGruppe,
  flyt: BehandlingFlytOgTilstand
) {
  const avklaringsbehov = getAvklaringsbehovForSteg(
    aktivStegGruppe,
    'BEKREFT_VURDERINGER_OPPFØLGING',
    flyt,
    Behovstype.BEKREFT_VURDERINGER_OPPFØLGING
  );

  const harAvklaringsbehov = avklaringsbehov.length > 0;
  const typeBehandling = flyt.visning.typeBehandling;
  const readOnly = flyt.visning.saksbehandlerReadOnly || (typeBehandling === 'Revurdering' && !harAvklaringsbehov);

  const harÅpentAvklaringsbehov = avklaringsbehov.some(
    (avklaringsbehov) => avklaringsbehov.endringer[avklaringsbehov.endringer.length - 1]?.status === 'OPPRETTET'
  );

  return {
    skalViseSteg: harÅpentAvklaringsbehov,
    readOnly: readOnly,
    behandlingVersjon: flyt.behandlingVersjon,
  };
}
