import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export type BehandlingInngang = 'SAKSOVERSIKT' | 'SAKSOVERSIKT_EKSTERN_LØSNING' | 'SØK_OPPGAVE' | 'MINE_OPPGAVER';
export type SaksoversiktInngang = 'MINE_OPPGAVER' | 'SØK_PERSON' | 'SØK_SAK';
export type OppgaveInngang = 'MINE_OPPGAVER'; // TODO, MINE_OPPGAVER, LEDIGE_OPPGAVER, ...

/**
 * Målet man navigerer til i `GÅ_TIL_<MÅL>`.
 */
export const UMAMI_NAVIGERING_MÅL = ['BEHANDLING', 'SAKSOVERSIKT'] as const;
type UmamiNavigeringMål = (typeof UMAMI_NAVIGERING_MÅL)[number];

/** Handlingen som utføres på en oppgave i `<HANDLING>_OPPGAVE`, se `UMAMI_NAVIGERING_MÅL`. */
export const UMAMI_OPPGAVE_HANDLING = ['RESERVER', 'FRIGI', 'TILDEL'] as const;
type UmamiOppgaveHandling = (typeof UMAMI_OPPGAVE_HANDLING)[number];

export type UmamiNavigeringNavn = `GÅ_TIL_${UmamiNavigeringMål}` | `${UmamiOppgaveHandling}_OPPGAVE`;

export interface UmamiNavigeringEvent {
  type: 'NAVIGERING';
  name: UmamiNavigeringNavn;
  inngang: BehandlingInngang | SaksoversiktInngang | OppgaveInngang;
  reserverer?: boolean;
}

export const loggUmamiGåTilBehandling = (inngang: BehandlingInngang) =>
  clientLoggUmamiEvent({ type: 'NAVIGERING', name: 'GÅ_TIL_BEHANDLING', inngang });

export const loggUmamiGåTilBehandlingOgReserver = (inngang: BehandlingInngang) =>
  clientLoggUmamiEvent({ type: 'NAVIGERING', name: 'GÅ_TIL_BEHANDLING', inngang, reserverer: true });

export const loggUmamiGåTilSaksoversikt = (inngang: SaksoversiktInngang) =>
  clientLoggUmamiEvent({ type: 'NAVIGERING', name: 'GÅ_TIL_SAKSOVERSIKT', inngang });

export const loggUmamiReserverOppgave = (inngang: BehandlingInngang) =>
  clientLoggUmamiEvent({ type: 'NAVIGERING', name: 'RESERVER_OPPGAVE', inngang });

export const loggUmamiFrigiOppgave = (inngang: OppgaveInngang) =>
  clientLoggUmamiEvent({ type: 'NAVIGERING', name: 'FRIGI_OPPGAVE', inngang });

export const loggUmamiTildelOppgave = (inngang: OppgaveInngang) =>
  clientLoggUmamiEvent({ type: 'NAVIGERING', name: 'TILDEL_OPPGAVE', inngang });
