import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getAvklaringsbehovForSteg, getStegData } from 'lib/utils/steg';
import { BistandsbehovMedDataFetching } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';
import { FastsettArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { RefusjonMedDataFetching } from 'components/behandlinger/sykdom/refusjon/RefusjonMedDataFetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SykdomsvurderingBrevMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrevMedDataFetching';
import { OvergangUforeMedDataFetching } from './overgangufore/OvergangUforeMedDataFetching';
import { OvergangArbeidMedDataFetching } from './overgangarbeid/OvergangArbeidMedDataFetching';
import { ArbeidsopptrappingMedDataFetching } from 'components/behandlinger/sykdom/arbeidsopptrapping/ArbeidsopptrappingMedDataFetching';
import { EtableringAvEgenVirksomhetMedDatafetching } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetMedDatafetching';
import { Behovstype } from 'lib/utils/form';
import { BehandlingFlytOgTilstand, StegGruppe } from 'lib/types/types';
import { BekreftVurderingerOppfølgingMedDataFetching } from 'components/behandlinger/sykdom/bekreftvurderingeroppfølging/BekreftVurderingerOppfølgingMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Sykdom = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const aktivStegGruppe = 'SYKDOM';
  const sykdomSteg = getStegData(aktivStegGruppe, 'AVKLAR_SYKDOM', flyt.data);
  const vurderBistandsbehovSteg = getStegData(aktivStegGruppe, 'VURDER_BISTANDSBEHOV', flyt.data);
  const arbeidsopptrappingSteg = getStegData(aktivStegGruppe, 'ARBEIDSOPPTRAPPING', flyt.data);
  const fritakMeldepliktSteg = getStegData(aktivStegGruppe, 'FRITAK_MELDEPLIKT', flyt.data);
  const etableringAvEgenVirksomhetSteg = getStegData(aktivStegGruppe, 'ETABLERING_EGEN_VIRKSOMHET', flyt.data);
  const fastsettArbeidsevneSteg = getStegData(aktivStegGruppe, 'FASTSETT_ARBEIDSEVNE', flyt.data);
  const refusjonskravSteg = getStegData(aktivStegGruppe, 'REFUSJON_KRAV', flyt.data);
  const sykdomsvurderingBrevSteg = getStegData(aktivStegGruppe, 'SYKDOMSVURDERING_BREV', flyt.data);
  const bekreftVurderingerOppfølgingSteg = getStegDataForBekreftVurderingerOppfølgingSteg(aktivStegGruppe, flyt.data);
  const vurderYrkesskadeSteg = getStegData(aktivStegGruppe, 'VURDER_YRKESSKADE', flyt.data);
  const vurderSykepengeerstatningSteg = getStegData(aktivStegGruppe, 'VURDER_SYKEPENGEERSTATNING', flyt.data);
  const overganguføreSteg = getStegData(aktivStegGruppe, 'OVERGANG_UFORE', flyt.data);
  const overgangarbeidSteg = getStegData(aktivStegGruppe, 'OVERGANG_ARBEID', flyt.data);

  return (
    <GruppeSteg
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {sykdomSteg.skalViseSteg && (
        <StegSuspense>
          <SykdomsvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={sykdomSteg} />
        </StegSuspense>
      )}
      {vurderBistandsbehovSteg.skalViseSteg && (
        <StegSuspense>
          <BistandsbehovMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={vurderBistandsbehovSteg}
          />
        </StegSuspense>
      )}
      {fritakMeldepliktSteg.skalViseSteg && (
        <StegSuspense>
          <MeldepliktMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={fritakMeldepliktSteg} />
        </StegSuspense>
      )}
      {etableringAvEgenVirksomhetSteg.skalViseSteg && (
        <StegSuspense>
          <EtableringAvEgenVirksomhetMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={etableringAvEgenVirksomhetSteg}
          />
        </StegSuspense>
      )}
      {fastsettArbeidsevneSteg.skalViseSteg && (
        <StegSuspense>
          <FastsettArbeidsevneMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={fastsettArbeidsevneSteg}
          />
        </StegSuspense>
      )}
      {arbeidsopptrappingSteg.skalViseSteg && (
        <StegSuspense>
          <ArbeidsopptrappingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={arbeidsopptrappingSteg}
          />
        </StegSuspense>
      )}

      <StegSuspense>
        <OvergangUforeMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={overganguføreSteg} />
      </StegSuspense>

      <StegSuspense>
        <OvergangArbeidMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={overgangarbeidSteg} />
      </StegSuspense>

      {refusjonskravSteg.skalViseSteg && (
        <StegSuspense>
          <RefusjonMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={refusjonskravSteg} />
        </StegSuspense>
      )}
      {sykdomsvurderingBrevSteg.skalViseSteg && (
        <StegSuspense>
          <SykdomsvurderingBrevMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={sykdomsvurderingBrevSteg}
          />
        </StegSuspense>
      )}
      {bekreftVurderingerOppfølgingSteg.skalViseSteg && !bekreftVurderingerOppfølgingSteg.readOnly && (
        <StegSuspense>
          <BekreftVurderingerOppfølgingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={bekreftVurderingerOppfølgingSteg.behandlingVersjon}
            readOnly={bekreftVurderingerOppfølgingSteg.readOnly}
          />
        </StegSuspense>
      )}
      {vurderYrkesskadeSteg.skalViseSteg && (
        <StegSuspense>
          <YrkesskadeMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderYrkesskadeSteg} />
        </StegSuspense>
      )}
      {vurderSykepengeerstatningSteg.skalViseSteg && (
        <StegSuspense>
          <SykepengeerstatningMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={vurderSykepengeerstatningSteg}
          />
        </StegSuspense>
      )}
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
