import { clientLoggUmamiEvent } from 'lib/utils/umami/client';
import { UmamiEventData } from '@umami/node';

export const UMAMI_BEHANDLERDIALOG_NAVN = [
  'BEHANDLERDIALOG_GÅ_TIL_SEND_FORESPØRSEL',
  'BEHANDLERDIALOG_SEND_FORESPØRSEL',
  'BEHANDLERDIALOG_SEND_MANUELL_PÅMINNELSE',
  'BEHANDLERDIALOG_AVBRYT_PÅMINNELSE',
  'BEHANDLERDIALOG_GJENOPPTA_PÅMINNELSE',
] as const;

export interface UmamiBehandlerdialogEvent {
  name: (typeof UMAMI_BEHANDLERDIALOG_NAVN)[number];
  data: UmamiEventData;
}

export function loggUmamiBehandlerdialogKlikk(name: UmamiBehandlerdialogEvent['name']) {
  clientLoggUmamiEvent(name);
}
