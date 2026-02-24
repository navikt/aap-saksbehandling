import { Vurderingsbehov, VurderingsbehovIntern } from 'lib/types/types';

export const formaterVurderingsbehov = (vurderingsbehov: Vurderingsbehov | VurderingsbehovIntern): string => {
  switch (vurderingsbehov) {
    case 'MOTTATT_SØKNAD':
      return 'Søknad';
    case 'SØKNAD':
      return 'Søknad';
    case 'MOTTATT_AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'FASTSATT_PERIODE_PASSERT':
      return 'Fastsatt periode passert';
    case 'MOTTATT_MELDEKORT':
      return 'Meldekort';
    case 'MELDEKORT':
      return 'Meldekort';
    case 'MOTTATT_LEGEERKLÆRING':
      return 'Legeerklæring';
    case 'LEGEERKLÆRING':
      return 'Legeerklæring';
    case 'MOTTATT_AVVIST_LEGEERKLÆRING':
      return 'Avvist legeerklæring';
    case 'AVVIST_LEGEERKLÆRING':
      return 'Avvist legeerklæring';
    case 'MOTTATT_DIALOGMELDING':
      return 'Dialogmelding';
    case 'DIALOGMELDING':
      return 'Dialogmelding';
    case 'G_REGULERING':
      return 'G-regulering';
    case 'REVURDER_MEDLEMSKAP':
      return 'Revurder medlemskap';
    case 'REVURDER_YRKESSKADE':
      return 'Revurder yrkesskade';
    case 'REVURDER_BEREGNING':
      return 'Revurder beregning';
    case 'REVURDER_LOVVALG':
      return 'Revurder lovvalg';
    case 'REVURDER_SAMORDNING':
      return 'Revurder samordning';
    case 'REVURDER_SAMORDNING_ANDRE_FOLKETRYGDYTELSER':
      return 'Forhold andre ytelser - Folketrygdytelser';
    case 'REVURDER_SAMORDNING_UFØRE':
      return 'Forhold andre ytelser - Samordning ufør';
    case 'REVURDER_SAMORDNING_ANDRE_STATLIGE_YTELSER':
      return 'Forhold andre ytelser - Andre ytelser avregning';
    case 'REVURDER_SAMORDNING_ARBEIDSGIVER':
      return 'Forhold andre ytelser - Arbeidsgiverytelse';
    case 'REVURDER_SAMORDNING_TJENESTEPENSJON':
      return 'Forhold andre ytelser - Tjenestepensjon';
    case 'REVURDER_STUDENT':
      return 'Revurder student';
    case 'MOTATT_KLAGE':
      return 'Klage';
    case 'KLAGE':
      return 'Klage';
    case 'LOVVALG_OG_MEDLEMSKAP':
      return 'Lovvalg og medlemskap';
    case 'FORUTGAENDE_MEDLEMSKAP':
      return 'Forutgående medlemskap';
    case 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND':
      return 'Sykdom arbeidsevne behov for bistand';
    case 'REVURDER_SYKEPENGEERSTATNING':
      return 'Revurdering sykepengererstatning';
    case 'BARNETILLEGG':
      return 'Barnetillegg';
    case 'INSTITUSJONSOPPHOLD':
      return 'Institusjonsopphold';
    case 'SAMORDNING_OG_AVREGNING':
      return 'Samordning og avregning';
    case 'REFUSJONSKRAV':
      return 'Refusjonskrav';
    case 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT':
      return 'Utenlandsopphold for soknadstidspunkt';
    case 'SØKNAD_TRUKKET':
      return 'Trukket søknad';
    case 'VURDER_RETTIGHETSPERIODE':
      return 'Vurder § 22-13 syvende ledd';
    case 'KLAGE_TRUKKET':
      return 'Klage trukket';
    case 'REVURDERING_AVBRUTT':
      return 'Revurdering avbrutt';
    case 'MOTTATT_KABAL_HENDELSE':
      return 'Mottatt svar fra Nav Klageinstans';
    case 'FRITAK_MELDEPLIKT':
      return 'Fritak meldeplikt';
    case 'REVURDER_MANUELL_INNTEKT':
      return 'Revurder manuell inntekt';
    case 'OPPFØLGINGSOPPGAVE':
      return 'Oppfølgingsoppgave';
    case 'HELHETLIG_VURDERING':
      return 'Helhetlig vurdering';
    case 'REVURDER_MELDEPLIKT_RIMELIG_GRUNN':
      return 'Revurder meldeplikt rimelig grunn';
    case 'AKTIVITETSPLIKT_11_7':
      return 'Aktivitetsplikt § 11-7';
    case 'AKTIVITETSPLIKT_11_9':
      return 'Aktivitetsplikt § 11-9';
    case 'EFFEKTUER_AKTIVITETSPLIKT':
      return 'Effektuer aktivitetsplikt § 11-7';
    case 'OVERGANG_UFORE':
      return 'Overgang til uføre';
    case 'OVERGANG_ARBEID':
      return 'Overgang arbeidssøker';
    case 'OPPHOLDSKRAV':
      return 'Oppholdskrav § 11-3';
    case 'DØDSFALL_BARN':
      return 'Dødsfall barn';
    case 'DØDSFALL_BRUKER':
      return 'Dødsfall bruker';
    case 'EFFEKTUER_AKTIVITETSPLIKT_11_9':
      return 'Effektuer aktivitetsplikt § 11-9';
    case 'BARNETILLEGG_SATS_REGULERING':
      return 'Satsregulering barnetillegg';
    case 'UTVID_VEDTAKSLENGDE':
      return 'Utvid vedtakslengde';
    case 'MIGRER_RETTIGHETSPERIODE':
      return 'Korrigering av teknisk periode (automatisk behandling)';
    case 'ETABLERING_EGEN_VIRKSOMHET':
      return '§ 11-15 Etablering av egen virksomhet';
    case 'REVURDER_SYKESTIPEND':
      return 'Revurder sykestipend';
    default:
      return vurderingsbehov;
  }
};

/*
 * Kombinerer behandlingsflyt og statistikks vurderingsbehov
 * */
export const formaterFrittVurderingsbehov = (vurderingsbehov: String) => {
  switch (vurderingsbehov) {
    case 'MOTTATT_SØKNAD':
    case 'SØKNAD':
      return 'Søknad';
    case 'MOTTATT_AKTIVITETSMELDING':
    case 'AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'FASTSATT_PERIODE_PASSERT':
      return 'Fastsatt periode passert';
    case 'MOTTATT_MELDEKORT':
    case 'MELDEKORT':
      return 'Meldekort';
    case 'MOTTATT_LEGEERKLÆRING':
    case 'LEGEERKLÆRING':
      return 'Legeerklæring';
    case 'MOTTATT_AVVIST_LEGEERKLÆRING':
    case 'AVVIST_LEGEERKLÆRING':
      return 'Avvist legeerklæring';
    case 'MOTTATT_DIALOGMELDING':
    case 'DIALOGMELDING':
      return 'Dialogmelding';
    case 'G_REGULERING':
      return 'G-regulering';
    case 'REVURDER_MEDLEMSKAP':
    case 'REVURDER_MEDLEMSSKAP':
      return 'Revurder medlemskap';
    case 'REVURDER_YRKESSKADE':
      return 'Revurder yrkesskade';
    case 'REVURDER_BEREGNING':
      return 'Revurder beregning';
    case 'REVURDER_LOVVALG':
      return 'Revurder lovvalg';
    case 'REVURDER_SAMORDNING':
      return 'Revurder samordning';
    case 'MOTATT_KLAGE':
    case 'KLAGE':
      return 'Klage';
    case 'LOVVALG_OG_MEDLEMSKAP':
      return 'Lovvalg og medlemskap';
    case 'FORUTGAENDE_MEDLEMSKAP':
      return 'Forutgående medlemskap';
    case 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND':
      return 'Arbeidsevne og behov for bistand';
    case 'BARNETILLEGG':
      return 'Barnetillegg';
    case 'INSTITUSJONSOPPHOLD':
      return 'Institusjonsopphold';
    case 'SAMORDNING_OG_AVREGNING':
      return 'Samordning og avregning';
    case 'REFUSJONSKRAV':
      return 'Refusjonskrav';
    case 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT':
      return 'Utenlandsopphold for soknadstidspunkt';
    case 'SØKNAD_TRUKKET':
      return 'Trukket søknad';
    case 'VURDER_RETTIGHETSPERIODE':
      return '§ 22-13 syvende ledd';
    case 'KLAGE_TRUKKET':
      return 'Klage trukket';
    case 'MOTTATT_KABAL_HENDELSE':
      return 'Mottatt svar fra Nav Klageinstans';
    case 'REVURDER_MANUELL_INNTEKT':
      return 'Revurder manuell inntekt';
    case 'REVURDER_MELDEPLIKT_RIMELIG_GRUNN':
      return 'Rimelig grunn til ikke overholdt meldeplikt';
    case 'AKTIVITETSPLIKT_11_7':
      return 'Aktivitetsplikt § 11-7';
    case 'OVERGANG_ARBEID':
      return 'Overgang til arbeid';
    case 'OVERGANG_UFORE':
      return 'Overgang til uføre';
    case 'BARNETILLEGG_SATS_REGULERING':
      return 'Satsregulering barnetillegg';
    case 'MIGRER_RETTIGHETSPERIODE':
      return 'Korrigering av teknisk periode (automatisk behandling)';
    default:
      return vurderingsbehov;
  }
};
