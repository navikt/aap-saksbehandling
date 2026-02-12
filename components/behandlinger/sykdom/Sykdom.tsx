import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData } from 'lib/utils/steg';
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

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
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
  const vurderYrkesskadeSteg = getStegData(aktivStegGruppe, 'VURDER_YRKESSKADE', flyt.data);
  const vurderSykepengeerstatningSteg = getStegData(aktivStegGruppe, 'VURDER_SYKEPENGEERSTATNING', flyt.data);
  const overganguføreSteg = getStegData(aktivStegGruppe, 'OVERGANG_UFORE', flyt.data);
  const overgangarbeidSteg = getStegData(aktivStegGruppe, 'OVERGANG_ARBEID', flyt.data);

  return (
    <GruppeSteg
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {sykdomSteg.skalViseSteg && (
        <StegSuspense>
          <SykdomsvurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={sykdomSteg} />
        </StegSuspense>
      )}
      {vurderBistandsbehovSteg.skalViseSteg && (
        <StegSuspense>
          <BistandsbehovMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            stegData={vurderBistandsbehovSteg}
          />
        </StegSuspense>
      )}
      {fritakMeldepliktSteg.skalViseSteg && (
        <StegSuspense>
          <MeldepliktMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={fritakMeldepliktSteg} />
        </StegSuspense>
      )}
      {etableringAvEgenVirksomhetSteg.skalViseSteg && (
        <StegSuspense>
          <EtableringAvEgenVirksomhetMedDatafetching
            behandlingsReferanse={behandlingsReferanse}
            stegData={etableringAvEgenVirksomhetSteg}
          />
        </StegSuspense>
      )}
      {fastsettArbeidsevneSteg.skalViseSteg && (
        <StegSuspense>
          <FastsettArbeidsevneMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            stegData={fastsettArbeidsevneSteg}
          />
        </StegSuspense>
      )}
      {arbeidsopptrappingSteg.skalViseSteg && (
        <StegSuspense>
          <ArbeidsopptrappingMedDataFetching
            behandlingsreferanse={behandlingsReferanse}
            stegData={arbeidsopptrappingSteg}
          />
        </StegSuspense>
      )}
      {overganguføreSteg.skalViseSteg && (
        <StegSuspense>
          <OvergangUforeMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={overganguføreSteg} />
        </StegSuspense>
      )}

      {overgangarbeidSteg.skalViseSteg && (
        <StegSuspense>
          <OvergangArbeidMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={overgangarbeidSteg} />
        </StegSuspense>
      )}
      {refusjonskravSteg.skalViseSteg && (
        <StegSuspense>
          <RefusjonMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={refusjonskravSteg} />
        </StegSuspense>
      )}
      {sykdomsvurderingBrevSteg.skalViseSteg && (
        <StegSuspense>
          <SykdomsvurderingBrevMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            stegData={sykdomsvurderingBrevSteg}
          />
        </StegSuspense>
      )}
      {vurderYrkesskadeSteg.skalViseSteg && (
        <StegSuspense>
          <YrkesskadeMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={vurderYrkesskadeSteg} />
        </StegSuspense>
      )}
      {vurderSykepengeerstatningSteg.skalViseSteg && (
        <StegSuspense>
          <SykepengeerstatningMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            stegData={vurderSykepengeerstatningSteg}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
