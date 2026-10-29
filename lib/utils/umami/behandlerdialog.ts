import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export const UMAMI_BEHANDLERDIALOG_NAVN = [
  'BEHANDLERDIALOG_GÅ_TIL_SEND_FORESPØRSEL',
  'BEHANDLERDIALOG_SEND_FORESPØRSEL',
  'BEHANDLERDIALOG_AVBRYT_PÅMINNELSE',
  'BEHANDLERDIALOG_GJENOPPTA_PÅMINNELSE',
] as const;

export interface UmamiBehandlerdialogEvent {
  type: 'BEHANDLERDIALOG';
  name: (typeof UMAMI_BEHANDLERDIALOG_NAVN)[number];
}

export function loggUmamiBehandlerdialogKlikk(name: UmamiBehandlerdialogEvent['name']) {
  clientLoggUmamiEvent({ type: 'BEHANDLERDIALOG', name });
}
