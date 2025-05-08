import { SettPåVentÅrsaker } from 'lib/types/types';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { OppgaveAvklaringsbehovKode, OppgaveBehandlingstype, OppgaveStatus } from 'lib/types/oppgaveTypes';

const behovskodeMap = {
  // Behandlingsflyt
  '5001': '§ 11-14 Student',
  '5003': '§ 11-5 Nedsatt arbeidsevne',
  '5004': '§ 11-23 Arbeidsevne som ikke er utnyttet',
  '5005': '§ 11-10 Fritak fra meldeplikt',
  '5006': '§ 11-6 Behov for bistand',
  '5007': '§ 11-13 Sykepengeerstatning',
  '5008': '§ 11-19 Beregningstidspunkt',
  '5009': '§ 11-20 Barnetillegg',
  '5010': '§ 11-26 Soning',
  '5011': '§ 11-25 Helseinstitusjon',
  '5012': 'Avklar samordning gradering',
  '5013': '§ 11-22 Yrkesskade',
  '5014': 'Fastsett yrkesskadebeløp',
  '5015': '§ 11-17 AAP som arbeidssøker',
  '5016': 'Forhåndsvarsel aktivitetsplikt',
  '5017': 'Lovvalg og medlemskap',
  '5018': 'Venter på uttalelse fra bruker på forhåndsvarsel',
  '5019': 'Venter på utenlandsoverføring',
  '5020': '§ 11-2 Forutgående medlemskap',
  '5021': 'Overstyr lovvalg og medlemskap',
  '5022': 'Overstyr § 11-2 Forutgående medlemskap',
  '5023': 'Venter på klageimplementasjon',
  '5024': 'Avklar samordning uføre',
  '5025': 'Samordning vent på virkningstidspunkt',
  '5026': 'Refusjon',
  '5027': 'Samordning annen statlig ytelse',
  '5028': 'Vurder trekk av søknad',
  '5029': 'Vurder starttidspunkt',
  '5050': 'Skriv brev',
  '5051': 'Skriv brev',
  '5056': 'Samordning refusjonskrav',
  '5097': 'Kvalitetssikre sak',
  '5098': 'Foreslå vedtak',
  '5099': 'Beslutte sak',
  '5999': 'Fastsett påklaget behandling',
  '6000': 'Formkrav',
  '9001': 'Manuelt satt på vent',
  '9002': 'Bestill brev',
  '9003': 'Bestill legeerklæring',
  '9004': 'Opprett hendelse på sak',

  // Postmottak
  '1337': 'Kategoriser dokument',
  '1338': 'Digitaliser dokument',
  '1339': 'Avklar tema',
  '1340': 'Avklar saksnummer',
  '1341': 'Endre tema',
} as const;

export function mapBehovskodeTilBehovstype(kode: OppgaveAvklaringsbehovKode | string): string {
  return behovskodeMap[kode as OppgaveAvklaringsbehovKode] ?? 'Ukjent behovstype';
}

export function mapTilVenteÅrsakTekst(årsak: SettPåVentÅrsaker): string {
  switch (årsak) {
    case 'VENTER_PÅ_OPPLYSNINGER':
      return 'Venter på opplysninger';
    case 'VENTER_PÅ_OPPLYSNINGER_FRA_UTENLANDSKE_MYNDIGHETER':
      return 'Venter på opplysninger fra utenlandske myndigheter';
    case 'VENTER_PÅ_MEDISINSKE_OPPLYSNINGER':
      return 'Venter på medisinske opplysninger';
    case 'VENTER_PÅ_VURDERING_AV_ROL':
      return 'Venter på vurdering fra rådgivende overlege';
    case 'VENTER_PÅ_SVAR_FRA_BRUKER':
      return 'Venter på svar fra bruker';
    case 'VENTER_PÅ_MASKINELL_AVKLARING':
      return 'Venter på maskinell avklaring';
    case 'VENTER_PÅ_UTENLANDSK_VIDEREFORING_AVKLARING':
      return 'Venter på videreføring av sak til utenlandsk trygdemyndighet';
    case 'VENTER_PÅ_KLAGE_IMPLEMENTASJON':
      return 'Venter på klageimplementasjon';
    case 'VENTER_PÅ_SVAR_PÅ_FORHÅNDSVARSEL':
      return 'Venter på svar på forhåndsvarsel';
    case 'VENTER_PÅ_FUNKSJONALITET':
      return 'Venter på manglende funksjonalitet';
  }
  exhaustiveCheck(årsak);
}

export function mapTilSteggruppeTekst(steggruppe: string) {
  switch (steggruppe) {
    case 'ALDER':
      return 'Alder';
    case 'LOVVALG':
      return 'Lovvalg';
    case 'START_BEHANDLING':
      return 'Start behandling';
    case 'MEDLEMSKAP':
      return 'Medlemskap';
    case 'BARNETILLEGG':
      return 'Barnetillegg';
    case 'STUDENT':
      return 'Student';
    case 'SYKDOM':
      return 'Sykdom';
    case 'GRUNNLAG':
      return 'Grunnlag';
    case 'ET_ANNET_STED':
      return 'Et annet sted';
    case 'UNDERVEIS':
      return 'Underveis';
    case 'TILKJENT_YTELSE':
      return 'Tilkjent ytelse';
    case 'SIMULERING':
      return 'Simulering';
    case 'VEDTAK':
      return 'Vedtak';
    case 'FATTE_VEDTAK':
      return 'Fatte vedtak';
    case 'KVALITETSSIKRING':
      return 'Kvalitetssikring';
    case 'IVERKSETT_VEDTAK':
      return 'Iverksett vedtak';
    case 'BREV':
      return 'Brev';
    case 'UDEFINERT':
      return 'Udefinert';
    case 'AVKLAR_TEMA':
      return 'Avklar tema';
    case 'AVKLAR_SAK':
      return 'Avklar sak';
    case 'DIGITALISER':
      return 'Digitaliser';
    case 'OVERLEVER_TIL_FAGSYSTEM':
      return 'Send til fagsystem';
    case 'RETTIGHETSPERIODE':
      return 'Starttidspunkt';
    case 'SAMORDNING':
      return 'Samordning';
    case 'FORMKRAV':
      return 'Formkrav';
    default:
      return `${steggruppe}`;
  }
}

export function mapTilOppgaveBehandlingstypeTekst(behandlingsType: OppgaveBehandlingstype) {
  switch (behandlingsType) {
    case 'FØRSTEGANGSBEHANDLING':
      return 'Førstegangsbehandling';
    case 'JOURNALFØRING':
      return 'Journalføring';
    case 'KLAGE':
      return 'Klage';
    case 'DOKUMENT_HÅNDTERING':
      return 'Dokumenthåndtering';
    case 'REVURDERING':
      return 'Revurdering';
    case 'TILBAKEKREVING':
      return 'Tilbakekreving';
  }
  exhaustiveCheck(behandlingsType);
}

export function mapTilOppgaveStatusTekst(status: OppgaveStatus) {
  switch (status) {
    case 'AVSLUTTET':
      return 'Avsluttet';
    case 'OPPRETTET':
      return 'Opprettet';
  }
}
