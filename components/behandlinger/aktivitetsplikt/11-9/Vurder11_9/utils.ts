import { BruddRad } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { Brudd } from 'lib/types/types';

export function formaterBrudd(brudd: Brudd) {
  switch (brudd) {
    case 'IKKE_MØTT_TIL_TILTAK':
      return 'Ikke møtt til tiltak';
    case 'IKKE_MØTT_TIL_BEHANDLING':
      return 'Ikke møtt til behandling';
    case 'IKKE_MØTT_TIL_MØTE':
      return 'Ikke møtt til møte med Nav';
    case 'IKKE_SENDT_DOKUMENTASJON':
      return 'Ikke sendt inn dokumentasjon som Nav har bedt om';
    default:
      return brudd;
  }
}

export function formaterGrunn(grunn: string) {
  switch (grunn) {
    case 'IKKE_RIMELIG_GRUNN':
      return 'Uten rimelig grunn';
    case 'RIMELIG_GRUNN':
      return 'Rimelig grunn';
    default:
      return grunn;
  }
}

export enum BruddStatus {
  IVERKSATT,
  IVERKSATT_OVERSKREVET,
  SENDT_TIL_BESLUTTER,
  SENDT_TIL_BESLUTTER_OVERSKREVET,
  SENDT_TIL_BESLUTTER_SLETTET,
  NY,
}

export function formaterStatus(status: BruddStatus) {
  switch (status) {
    case BruddStatus.IVERKSATT:
    case BruddStatus.IVERKSATT_OVERSKREVET:
      return 'Iverksatt';
    case BruddStatus.SENDT_TIL_BESLUTTER:
    case BruddStatus.SENDT_TIL_BESLUTTER_OVERSKREVET:
    case BruddStatus.SENDT_TIL_BESLUTTER_SLETTET:
      return 'Sendt til beslutter';
    case BruddStatus.NY:
      return 'Ny';
  }
}

export function erOverskrevet(rad: BruddRad) {
  return [
    BruddStatus.IVERKSATT_OVERSKREVET,
    BruddStatus.SENDT_TIL_BESLUTTER_SLETTET,
    BruddStatus.SENDT_TIL_BESLUTTER_OVERSKREVET,
  ].includes(rad.status!!);
}

export function erNy(rad: BruddRad) {
  return [BruddStatus.SENDT_TIL_BESLUTTER, BruddStatus.NY].includes(rad.status!!);
}
