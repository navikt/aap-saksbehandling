import { SettPåVentÅrsaker } from 'lib/types/types';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { OppgaveAvklaringsbehovKode, OppgaveBehandlingstype, OppgaveStatus } from 'lib/types/oppgaveTypes';

export function mapBehovskodeTilBehovstype(kode: OppgaveAvklaringsbehovKode): string {
  switch (kode) {
    //Behandlingsflyt
    case '5001':
      return '§ 11-14 Student';
    case '5003':
      return '§ 11-5 Nedsatt arbeidsevne';
    case '5004':
      return '§ 11-23 Arbeidsevne som ikke er utnyttet';
    case '5005':
      return '§ 11-10 Fritak fra meldeplikt';
    case '5006':
      return '§ 11-6 Behov for bistand';
    case '5007':
      return '§ 11-13 Sykepengeerstatning';
    case '5008':
      return '§ 11-19 Beregningstidspunkt';
    case '5009':
      return '§ 11-20 Barnetillegg';
    case '5098':
      return 'Foreslå vedtak';
    case '5099':
      return 'Beslutte sak';
    case '5097':
      return 'Kvalitetssikre sak';
    case '9001':
      return 'Manuelt satt på vent';
    case '9002':
      return 'Bestill brev';
    case '9003':
      return 'Bestill legeerklæring';
    case '5010':
      return '§ 11-26 Soning';
    case '5011':
      return '§ 11-25 Helseinstitusjon';
    case '5012':
      return 'Avklar samordning gradering';
    case '5013':
      return '§ 11-22 Yrkesskade';
    case '5014':
      return 'Fastsett yrkesskadebeløp';
    case '5015':
      return '§ 11-17 AAP som arbeidssøker';
    case '5016':
      return 'Forhåndsvarsel aktivitetsplikt';
    case '5017':
      return 'Lovvalg og medlemskap';
    case '5019':
      return 'Venter på utenlandsoverføring';
    case '5020':
      return '§ 11-2 Forutgående medlemskap';
    case '5050':
      return 'Skriv brev';
    case '5018':
      return 'Venter på uttalelse fra bruker på forhåndsvarsel';
    case '5021':
      return 'Overstyr lovvalg og medlemskap';
    case '5022':
      return 'Overstyr § 11-2 Forutgående medlemskap';
    case '5023':
      return 'Venter på klageimplementasjon';
    case '5024':
      return 'Avklar samordning uføre';
    case '5025':
      return 'Samordning vent på virkningstidspunkt';
    case '5026':
      return 'Refusjon';
    case '5027':
      return 'Samordning annen statlig ytelse';
    // Postmottak
    case '1337':
      return 'Kategoriser dokument';
    case '1338':
      return 'Digitaliser dokument';
    case '1339':
      return 'Avklar tema';
    case '1340':
      return 'Avklar saksnummer';
    case '1341':
      return 'Endre tema';
  }
  exhaustiveCheck(kode);
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
      return 'Venter på vurdering av rol';
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
