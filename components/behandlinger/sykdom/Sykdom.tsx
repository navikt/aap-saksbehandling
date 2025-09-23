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
import { isLocal } from 'lib/utils/environment';
import { OvergangUforeMedDataFetching } from './overgangufore/OvergangUforeMedDataFetching';
import { OvergangArbeidMedDataFetching } from './overgangarbeid/OvergangArbeidMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const overgangUføreFeature = () => isLocal();
export const overgangArbeidFeature = ()=> false;

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const aktivStegGruppe = 'SYKDOM';
  const sykdomSteg = getStegData(aktivStegGruppe, 'AVKLAR_SYKDOM', flyt.data);
  const vurderBistandsbehovSteg = getStegData(aktivStegGruppe, 'VURDER_BISTANDSBEHOV', flyt.data);
  const fritakMeldepliktSteg = getStegData(aktivStegGruppe, 'FRITAK_MELDEPLIKT', flyt.data);
  const fastsettArbeidsevneSteg = getStegData(aktivStegGruppe, 'FASTSETT_ARBEIDSEVNE', flyt.data);
  const refusjonskravSteg = getStegData(aktivStegGruppe, 'REFUSJON_KRAV', flyt.data);
  const sykdomsvurderingBrevSteg = getStegData(aktivStegGruppe, 'SYKDOMSVURDERING_BREV', flyt.data);
  const vurderYrkesskadeSteg = getStegData(aktivStegGruppe, 'VURDER_YRKESSKADE', flyt.data);
  const vurderSykepengeerstatningSteg = getStegData(aktivStegGruppe, 'VURDER_SYKEPENGEERSTATNING', flyt.data);
  const overganguføreSteg = overgangUføreFeature() ? getStegData(aktivStegGruppe, 'OVERGANG_UFORE', flyt.data) : null;
  const overgangarbeidSteg = overgangArbeidFeature() ? getStegData(aktivStegGruppe, 'OVERGANG_ARBEID', flyt.data) : null;

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
            overgangUføreEnabled={overgangUføreFeature()}
            overgangArbeidEnabled={overgangArbeidFeature()}
          />
        </StegSuspense>
      )}
      {fritakMeldepliktSteg.skalViseSteg && (
        <StegSuspense>
          <MeldepliktMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={fritakMeldepliktSteg} />
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
      {refusjonskravSteg.skalViseSteg && (
        <StegSuspense>
          <RefusjonMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={refusjonskravSteg} />
        </StegSuspense>
      )}
      {overgangUføreFeature() && overganguføreSteg !== null && overganguføreSteg.skalViseSteg && (
        <StegSuspense>
          <OvergangUforeMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={overganguføreSteg} />
        </StegSuspense>
      )}
      {overgangArbeidFeature() && overgangarbeidSteg !== null && overgangarbeidSteg.skalViseSteg && (
        <StegSuspense>
          <OvergangArbeidMedDataFetching behandlingsReferanse={behandlingsReferanse} stegData={overgangarbeidSteg} />
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
