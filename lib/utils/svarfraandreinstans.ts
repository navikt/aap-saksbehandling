import { KabalSvarType, KabalUtfall } from 'lib/types/types';

export function formaterUtfall(utfall: KabalUtfall): string {
  switch (utfall) {
    case 'TRUKKET':
      return 'Trukket';
    case 'RETUR':
      return 'Retur';
    case 'OPPHEVET':
      return 'Opphevet';
    case 'MEDHOLD':
      return 'Medhold';
    case 'DELVIS_MEDHOLD':
      return 'Delvis medhold';
    case 'STADFESTELSE':
      return 'Stadfestelse';
    case 'UGUNST':
      return 'Ugunst';
    case 'AVVIST':
      return 'Avvist';
    case 'HEVET':
      return 'Hevet';
    case 'INNSTILLING_STADFESTELSE':
      return 'Innstilling stadfestet';
    case 'INNSTILLING_AVVIST':
      return 'Innstilling avvist';
    case 'MEDHOLD_ETTER_FVL_35':
      return 'Medhold etter forvaltningsloven § 35';
    default:
      return 'Ukjent utfall';
  }
}

export function formaterSvartype(svarType: KabalSvarType): string {
  switch (svarType) {
    case 'KLAGEBEHANDLING_AVSLUTTET':
      return 'Klagebehandling avsluttet ';
    case 'ANKEBEHANDLING_OPPRETTET':
      return 'Ankebehandling opprettet';
    case 'ANKEBEHANDLING_AVSLUTTET':
      return 'Ankebehandling avsluttet';
    case 'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET':
      return 'Anke i Trygderetten opprettet';
    case 'BEHANDLING_FEILREGISTRERT':
      return 'Behandling feilregistrert';
    case 'BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET_AVSLUTTET':
      return 'Behandling i Trygderettens opphevet eller avsluttet';
    case 'OMGJOERINGSKRAVBEHANDLING_AVSLUTTET':
      return 'Behandling av omgjøringskrav avsluttet';
  }
}
