import { BehandlingInfo, SaksInfo, ÅrsakTilOpprettelse } from 'lib/types/types';

// TODO: Oppdater BehandlinginfoDTO til å returnere enum i stedet for string slik at vi kan få disse fra backend
export enum Behandlingstype {
  Førstegangsbehandling = 'ae0034',
  Revurdering = 'ae0028',
  Klage = 'ae0058',
  SvarFraAndreinstans = 'svar-fra-andreinstans',
  Oppfølgingsbehandling = 'oppfølgingsbehandling',
  Aktivitetsplikt11_7 = 'aktivitetsplikt',
  Aktivitetsplikt11_9 = 'aktivitetsplikt11-9',
  Tilbakekreving = 'ae0203',
}

export function erFørstegangsbehandling(behandling: BehandlingInfo): boolean {
  return behandling.type === Behandlingstype.Førstegangsbehandling;
}

export function erAvsluttet(behandling: BehandlingInfo) {
  return ['IVERKSETTES', 'AVSLUTTET'].includes(behandling.status);
}

export function erTrukket(behandling: BehandlingInfo) {
  return behandling.vurderingsbehov.includes('SØKNAD_TRUKKET');
}

export function erAvsluttetFørstegangsbehandling(behandling: BehandlingInfo): boolean {
  return erFørstegangsbehandling(behandling) && erAvsluttet(behandling) && !erTrukket(behandling);
}

export function erAktivFørstegangsbehandling(behandlinger: BehandlingInfo[]): boolean {
  return behandlinger.some((b) => erFørstegangsbehandling(b) && !erAvsluttet(b));
}

export function formaterBehandlingType(behandlingtype: Behandlingstype): string {
  switch (behandlingtype) {
    case Behandlingstype.Førstegangsbehandling:
      return 'Førstegangsbehandling';
    case Behandlingstype.Revurdering:
      return 'Revurdering';
    case Behandlingstype.Klage:
      return 'Klage';
    case Behandlingstype.SvarFraAndreinstans:
      return 'Svar fra Nav Klageinstans';
    case Behandlingstype.Oppfølgingsbehandling:
      return 'Oppfølgingsoppgave';
    case Behandlingstype.Aktivitetsplikt11_7:
      return 'Aktivitetsplikt § 11-7';
    case Behandlingstype.Aktivitetsplikt11_9:
      return 'Aktivitetsplikt § 11-9';
    case Behandlingstype.Tilbakekreving:
      return 'Tilbakekreving';
    default:
      return `Ukjent behandlingtype (${behandlingtype})`;
  }
}

export function formatterÅrsakTilOpprettelseTilTekst(årsakTilOpprettelse: ÅrsakTilOpprettelse): string {
  switch (årsakTilOpprettelse) {
    case 'SØKNAD':
      return 'Søknad';
    case 'MANUELL_OPPRETTELSE':
      return 'Manuelt opprettet';
    case 'HELSEOPPLYSNINGER':
      return 'Helseopplysninger';
    case 'ANNET_RELEVANT_DOKUMENT':
      return 'Annet relevant dokument';
    case 'OMGJØRING_ETTER_KLAGE':
      return 'Omgjøring etter klage';
    case 'OMGJØRING_ETTER_SVAR_FRA_KLAGEINSTANS':
      return 'Omgjøring etter svar fra klageinstans';
    case 'FASTSATT_PERIODE_PASSERT':
      return 'Fastsatt periode passert';
    case 'FRITAK_MELDEPLIKT':
      return 'Fritak meldeplikt';
    case 'MELDEKORT':
      return 'Meldekort';
    case 'AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'OPPFØLGINGSOPPGAVE':
      return 'Manuelt opprettet';
    case 'OPPFØLGINGSOPPGAVE_SAMORDNING_GRADERING':
      return 'Maksdato annen full ytelse';
    case 'SVAR_FRA_KLAGEINSTANS':
      return 'Svar fra klageinstans';
    case 'KLAGE':
      return 'Klage';
    case 'ENDRING_I_REGISTERDATA':
      return 'Endring i register';
    case 'AKTIVITETSPLIKT':
      return 'Aktivitetsplikt 11-7';
    case 'AKTIVITETSPLIKT_11_9':
      return 'Aktivitetsplikt 11-9';
    case 'TILBAKEKREVING_HENDELSE':
      return 'Mulig feilutbetaling';
    case 'UTVID_VEDTAKSLENGDE':
      return 'Utvid vedtakslengde';
    default:
      return 'Ukjent årsak';
  }
}
