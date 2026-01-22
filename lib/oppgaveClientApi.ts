import {
  AvreserverOppgaveDto,
  Kø,
  NesteOppgaveRequestBody,
  NesteOppgaveResponse,
  Oppgave,
  OppgavelisteRequest,
  OppgavelisteResponse,
  PlukkOppgaveDto,
} from './types/oppgaveTypes';
import {
  AntallÅpneOgGjennomsnitt,
  BehandlingAvklaringsbehovReturDTO,
  BehandlingPerSteggruppe,
  BehandlingÅrsakAntallGjennomsnitt,
  FordelingLukkedeBehandlinger,
  FordelingÅpneBehandlinger,
  OppgaverPerSteggruppe,
  VenteÅrsakOgGjennomsnitt,
} from './types/statistikkTypes';
import { BehandlingEndringerPerDag } from 'lib/types/statistikkTypes';
import { mineOppgaverQueryParams, queryParamsArray } from './utils/request';
import { clientFetch } from 'lib/clientApi';
import { SortState } from '@navikt/ds-react';

// statistikk
export async function antallÅpneBehandlingerPerBehandlingstypeClient(url: string) {
  return clientFetch<Array<AntallÅpneOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerUtviklingClient(url: string) {
  return clientFetch<Array<BehandlingEndringerPerDag>>(url, 'GET');
}

export async function fordelingÅpneBehandlingerClient(url: string) {
  return clientFetch<Array<FordelingÅpneBehandlinger>>(url, 'GET');
}

export async function fordelingLukkedeBehandlingerClient(url: string) {
  return clientFetch<Array<FordelingLukkedeBehandlinger>>(url, 'GET');
}

export async function venteÅrsakerClient(url: string) {
  return clientFetch<Array<VenteÅrsakOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerPerSteggruppeClient(url: string) {
  return clientFetch<Array<BehandlingPerSteggruppe>>(url, 'GET');
}

export async function oppgaverPerSteggruppeClient(url: string) {
  return clientFetch<OppgaverPerSteggruppe>(url, 'GET');
}

export async function årsakTilBehandlingClient(url: string) {
  return clientFetch<Array<BehandlingÅrsakAntallGjennomsnitt>>(url, 'GET');
}

export async function antallÅpneBehandlingerMedReturPerAvklaringsbehovClient(url: string) {
  return clientFetch<Array<BehandlingAvklaringsbehovReturDTO>>(url, 'GET');
}

// oppgave
export async function hentOppgaverClient(oppgavelisteRequest: OppgavelisteRequest) {
  return clientFetch<OppgavelisteResponse>('/oppgave/api/oppgave/oppgaveliste', 'POST', oppgavelisteRequest);
}
export async function hentOppgaveClient(behandlingsreferanse: string) {
  return clientFetch<Oppgave>(`/oppgave/api/oppgave/${behandlingsreferanse}/hent`, 'GET');
}

export async function hentMineOppgaverClient(sortering?: SortState) {
  const query = sortering ? mineOppgaverQueryParams(sortering) : '';
  return clientFetch<OppgavelisteResponse>(`/oppgave/api/oppgave/mine-oppgaver?${query}`, 'GET');
}

export async function avreserverOppgaveClient(oppgaver: number[]) {
  const body: AvreserverOppgaveDto = {
    oppgaver: oppgaver,
  };
  return clientFetch('/oppgave/api/oppgave/avreserver', 'POST', body);
}
export async function hentKøerForEnheterClient(enheter: string[]) {
  const url = `/oppgave/api/filter?${queryParamsArray('enheter', enheter)}`;
  return clientFetch<Kø[]>(url, 'GET');
}

export async function plukkNesteOppgaveClient(filterId: number, valgteEnhetsnumre: string[]) {
  const payload: NesteOppgaveRequestBody = { filterId, enheter: valgteEnhetsnumre };
  return await clientFetch<NesteOppgaveResponse | null>('/oppgave/api/oppgave/neste', 'POST', payload);
}
export async function plukkOppgaveClient(oppgaveId: number, versjon: number) {
  const payload: PlukkOppgaveDto = { oppgaveId, versjon };
  return await clientFetch<Oppgave>('/oppgave/api/oppgave/plukk-oppgave', 'POST', payload);
}
export async function synkroniserOppgaveMedEnhetClient(oppgaveId: number) {
  return await clientFetch<void>('/oppgave/api/oppgave/synkroniser-enhet-paa-oppgave', 'POST', {
    oppgaveId: oppgaveId,
  });
}
export function clientMottattDokumenterLest(behandlingsreferanse: string) {
  return clientFetch(`/oppgave/api/oppgave/mottatt-dokumenter-lest`, 'POST', {
    behandlingRef: behandlingsreferanse,
  });
}
