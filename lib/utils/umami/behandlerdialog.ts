import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export const UMAMI_BEHANDLERDIALOG_NAVN = [
  'BEHANDLERDIALOG_BESTILL_LEGEERKLÆRING_KLIKK',
  'BEHANDLERDIALOG_SEND_PÅMINNELSE_KLIKK',
  'BEHANDLERDIALOG_AVBRYT_PÅMINNELSE_KLIKK',
  'BEHANDLERDIALOG_GJENOPPTA_PÅMINNELSE_KLIKK',
] as const;

export interface UmamiBehandlerdialogEvent {
  type: 'BEHANDLERDIALOG';
  name: (typeof UMAMI_BEHANDLERDIALOG_NAVN)[number];
}

export function loggUmamiBehandlerdialogKlikk(name: UmamiBehandlerdialogEvent['name']) {
  clientLoggUmamiEvent({ type: 'BEHANDLERDIALOG', name });
}
