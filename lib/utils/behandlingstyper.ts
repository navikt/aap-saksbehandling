import { exhaustiveCheck } from 'lib/utils/typescript';
import { NoNavAapOppgaveOppgaveDtoBehandlingstype } from '@navikt/aap-oppgave-typescript-types';
import { PathsBehandlingstidGetParametersQueryBehandlingstyper } from '@navikt/aap-statistikk-typescript-types';
import { BehandlingstyperRequestQuery } from 'lib/types/statistikkTypes';
import { ValuePair } from 'components/form/FormField';

export const oppgaveBehandlingstyper = Object.keys(
  NoNavAapOppgaveOppgaveDtoBehandlingstype as unknown as keyof (typeof NoNavAapOppgaveOppgaveDtoBehandlingstype)[]
)
  .map((key) => key as keyof typeof NoNavAapOppgaveOppgaveDtoBehandlingstype)
  .map((key) => {
    switch (key) {
      case 'F_RSTEGANGSBEHANDLING':
        return { label: 'Førstegangsbehandling', value: 'FØRSTEGANGSBEHANDLING' };
      case 'TILBAKEKREVING':
        return { label: 'Tilbakekreving', value: 'TILBAKEKREVING' };
      case 'REVURDERING':
        return { label: 'Revurdering', value: 'REVURDERING' };
      case 'KLAGE':
        return { label: 'Klage', value: 'KLAGE' };
      case 'DOKUMENT_H_NDTERING':
        return { label: 'Dokumenthåndtering', value: 'DOKUMENTHÅNDTERING' };
      case 'JOURNALF_RING':
        return { label: 'Journalføring', value: 'JOURNALFØRING' };
      case 'SVAR_FRA_ANDREINSTANS':
        return { label: 'Svar fra andreinstans', value: 'SVAR_FRA_ANDREINSTANS' };
      case 'OPPF_LGINGSBEHANDLING':
        return { label: 'Oppfølgingsoppgave', value: 'OPPFØLGINGSBEHANDLING' };
    }
    exhaustiveCheck(key);
  });

const behandlingsTypeAlternativerFraEnum = Object.keys(
  PathsBehandlingstidGetParametersQueryBehandlingstyper as unknown as keyof (typeof PathsBehandlingstidGetParametersQueryBehandlingstyper)[]
)
  .map((key) => key as keyof typeof PathsBehandlingstidGetParametersQueryBehandlingstyper)
  .map((key) => {
    switch (key) {
      case 'F_rstegangsbehandling':
        return 'Førstegangsbehandling';
      case 'Tilbakekreving':
        return 'Tilbakekreving';
      case 'Revurdering':
        return 'Revurdering';
      case 'Klage':
        return 'Klage';
      case 'Dokumenth_ndtering':
        return 'Dokumenthåndtering';
      case 'Journalf_ring':
        return 'Journalføring';
      case 'SvarFraAndreinstans':
        return 'SvarFraAndreinstans';
      case 'Oppf_lgingsbehandling':
        return 'Oppfølgingsbehandling';
    }
    exhaustiveCheck(key);
  });
export type BehandlingsTyperOption = BehandlingstyperRequestQuery;
export const behandlingsTyperOptions: BehandlingsTyperOption[] = behandlingsTypeAlternativerFraEnum;

export const OppgaveStatuser: ValuePair[] = [
  { label: 'På vent', value: 'VENT' },
  { label: 'Retur fra kvalitetssikrer', value: 'RETUR_KVALITETSSIKRER' },
  { label: 'Retur fra beslutter', value: 'RETUR_BESLUTTER' },
];
