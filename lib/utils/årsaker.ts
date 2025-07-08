import { ÅrsakTilBehandling } from 'lib/types/types';

export const formaterÅrsak = (årsak: ÅrsakTilBehandling) => {
  switch (årsak) {
    case 'MOTTATT_SØKNAD':
      return 'Søknad';
    case 'MOTTATT_AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'FASTSATT_PERIODE_PASSERT':
      return 'Fastsatt periode passert';
    case 'MOTTATT_MELDEKORT':
      return 'Meldekort';
    case 'MOTTATT_LEGEERKLÆRING':
      return 'Legeerklæring';
    case 'MOTTATT_AVVIST_LEGEERKLÆRING':
      return 'Avvist legeerklæring';
    case 'MOTTATT_DIALOGMELDING':
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
    case 'MOTATT_KLAGE':
      return 'Klage';
    case 'LOVVALG_OG_MEDLEMSKAP':
      return 'Lovvalg og medlemskap';
    case 'FORUTGAENDE_MEDLEMSKAP':
      return 'Forutgående medlemskap';
    case 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND':
      return 'Sykdom arbevne behov for bistand';
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
      return 'Starttidspunkt';
    case 'KLAGE_TRUKKET':
      return 'Klage trukket';
    case 'MOTTATT_KABAL_HENDELSE':
      return 'Mottatt svar fra Nav Klageinstans';
    default:
      return årsak;
  }
};

/*
 * Kombinerer behandlingsflyt og statistikks årsaker
 * */
export const formaterFrittÅrsak = (årsak: String) => {
  switch (årsak) {
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
      return 'Sykdom arbevne behov for bistand';
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
      return 'Starttidspunkt';
    case 'KLAGE_TRUKKET':
      return 'Klage trukket';
    case 'MOTTATT_KABAL_HENDELSE':
      return 'Mottatt svar fra Nav Klageinstans';
    case 'REVURDER_MANUELL_INNTEKT':
      return 'Revurder manuell inntekt';
    default:
      return årsak;
  }
};
