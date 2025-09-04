import { exhaustiveCheck } from 'lib/utils/typescript';
import { EnvelopeClosedIcon, GavelSoundBlockIcon, PlayIcon } from '@navikt/aksel-icons';

export type HistorikkEvent =
  | 'SATT_PÅ_VENT' //  Behandling satt på vent, med årsak og begrunnelse
  | 'TATT_AV_VENT' // Behandling tatt av vent, med årsak
  | 'VEDTAK_FATTET' // Resultat, evt avslag med årsak
  | 'BREV_SENDT' //  Sendte brev med tittel
  | 'SENDT_TIL_BESLUTTER'
  | 'RETUR_FRA_BESLUTTER'
  | 'SENDT_TIL_KVALITETSSIKRER' // med resulta
  | 'RETUR_FRA_KVALITETSSIKRER' // med resultat og eventuell årsak for retur + begrunnelse
  | 'REVURDERING_OPPRETTET'
  | 'FØRSTEGANGSBEHANDLING_OPPRETTET'
  | 'KLAGE_OPPRETTET'
  | 'MOTTATT_DIALOGMELDING' // ? Mottatt legeerklæring og dialogmelding
  | 'BESTILT_LEGEERKLÆRING';

export function mapEventTilString(historikkEvent: HistorikkEvent) {
  switch (historikkEvent) {
    case 'SATT_PÅ_VENT':
      return 'Satt på vent';
    case 'TATT_AV_VENT':
      return 'Tatt av vent';
    case 'VEDTAK_FATTET':
      return 'Vedtak fattet';
    case 'BREV_SENDT':
      return 'Brev sendt';
    case 'SENDT_TIL_BESLUTTER':
      return 'Sendt til beslutter';
    case 'RETUR_FRA_BESLUTTER':
      return 'Retur fra beslutter';
    case 'SENDT_TIL_KVALITETSSIKRER':
      return 'Sendt til kvalitetssikrer';
    case 'RETUR_FRA_KVALITETSSIKRER':
      return 'Retur fra kvalitetssikrer';
    case 'REVURDERING_OPPRETTET':
      return 'Revurdering opprettet';
    case 'FØRSTEGANGSBEHANDLING_OPPRETTET':
      return 'Førstegangsbehandling opprettet';
    case 'KLAGE_OPPRETTET':
      return 'Klage opprettet';
    case 'MOTTATT_DIALOGMELDING':
      return 'Mottat dialogmelding';
    case 'BESTILT_LEGEERKLÆRING':
      return 'Bestilt legeerklæring';
  }
  exhaustiveCheck(historikkEvent);
}

export function mapEventTilIkon(historikkEvent: HistorikkEvent) {
  switch (historikkEvent) {
    case 'SATT_PÅ_VENT':
      return null;
    case 'TATT_AV_VENT':
      return null;
    case 'VEDTAK_FATTET':
      return <GavelSoundBlockIcon title="vedtakk fattet" fontSize="1.5rem" />;
    case 'BREV_SENDT':
      return <EnvelopeClosedIcon title="brev sendt" fontSize="1.5rem" />;
    case 'SENDT_TIL_BESLUTTER':
      return null;
    case 'RETUR_FRA_BESLUTTER':
      return null;
    case 'SENDT_TIL_KVALITETSSIKRER':
      return null;
    case 'RETUR_FRA_KVALITETSSIKRER':
      return null;
    case 'REVURDERING_OPPRETTET':
      return <PlayIcon title="revurdering opprettet" fontSize="1.5rem" />;
    case 'FØRSTEGANGSBEHANDLING_OPPRETTET':
      return <PlayIcon title="førstegangsbehandling opprettet" fontSize="1.5rem" />;
    case 'KLAGE_OPPRETTET':
      return <PlayIcon title="klage opprettet" fontSize="1.5rem" />;
    case 'MOTTATT_DIALOGMELDING':
      return null;
    case 'BESTILT_LEGEERKLÆRING':
      return null;
  }
  exhaustiveCheck(historikkEvent);
}
