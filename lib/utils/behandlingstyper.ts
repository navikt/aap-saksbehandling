import { Behandlingstype } from 'lib/types/oppgaveTypes';

import { ValuePair } from 'components/form/FormField';

export const oppgaveBehandlingstyper: { label: string; value: Behandlingstype }[] = [
  { label: 'Førstegangsbehandling', value: 'FØRSTEGANGSBEHANDLING' },
  { label: 'Tilbakekreving', value: 'TILBAKEKREVING' },
  { label: 'Revurdering', value: 'REVURDERING' },
  { label: 'Klage', value: 'KLAGE' },
  { label: 'Dokumenthåndtering', value: 'DOKUMENT_HÅNDTERING' },
  { label: 'Journalføring', value: 'JOURNALFØRING' },
  { label: 'Svar fra andreinstans', value: 'SVAR_FRA_ANDREINSTANS' },
  { label: 'Oppfølgingsoppgave', value: 'OPPFØLGINGSBEHANDLING' },
  { label: 'Aktivitetsplikt', value: 'AKTIVITETSPLIKT' },
  { label: 'Aktivitetsplikt 11-9', value: 'AKTIVITETSPLIKT_11_9' },
  { label: 'Fordeling', value: 'FORDELING' },
];

export const OppgaveStatuser: ValuePair[] = [
  { label: 'På vent', value: 'VENT' },
  { label: 'Retur fra kvalitetssikrer', value: 'RETUR_FRA_KVALITETSSIKRER' },
  { label: 'Retur fra beslutter', value: 'RETUR_FRA_BESLUTTER' },
  { label: 'Retur fra veileder', value: 'RETUR_FRA_VEILEDER' },
  { label: 'Retur fra saksbehandler', value: 'RETUR_FRA_SAKSBEHANDLER' },
  { label: 'Hastesak', value: 'ER_HASTESAK' },
  { label: 'Ventefrist utløpt', value: 'VENTEFRIST_UTLØPT' },
];
